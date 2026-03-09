# backend/models/train_indicator_model.py
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import gym
import numpy as np
from stable_baselines3 import PPO
from data.dataset_loader import load_all

class TradingEnv(gym.Env):

    def __init__(self,data):

        super().__init__()

        self.data=data.values
        self.step_index=0

        self.action_space=gym.spaces.Discrete(3)

        self.observation_space=gym.spaces.Box(
            low=-np.inf,
            high=np.inf,
            shape=(5,),
            dtype=np.float32
        )

    def reset(self):

        self.step_index=0

        return self.data[self.step_index]

    def step(self,action):

        self.step_index+=1

        done=self.step_index>=len(self.data)-1

        price_now=self.data[self.step_index][3]
        price_next=self.data[self.step_index+1][3]

        reward=0

        if action==1:
            reward=price_next-price_now

        if action==2:
            reward=price_now-price_next

        obs=self.data[self.step_index]

        return obs,reward,done,{}


df=load_all()[["open","high","low","close","volume"]]

env=TradingEnv(df)

model=PPO("MlpPolicy",env,verbose=1)

model.learn(total_timesteps=10000)

model.save("rl_agent")

print("RL agent trained")