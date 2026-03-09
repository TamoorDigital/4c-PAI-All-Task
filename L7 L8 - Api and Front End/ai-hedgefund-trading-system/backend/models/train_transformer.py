
# import sys
# import os

# sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# import torch
# import torch.nn as nn
# import pandas as pd
# from data.dataset_loader import load_all


# SEQ = 100

# class TransformerModel(nn.Module):

#     def __init__(self,input_dim=5):

#         super().__init__()

#         self.encoder = nn.TransformerEncoder(
#             nn.TransformerEncoderLayer(
#                 d_model=input_dim,
#                 nhead=1
#             ),
#             num_layers=2
#         )

#         self.fc = nn.Linear(input_dim,2)

#     def forward(self,x):

#         x=self.encoder(x)

#         x=x.mean(dim=1)

#         return self.fc(x)


# def create_sequences(df):

#     X=[]
#     y=[]

#     for i in range(len(df)-SEQ-10):

#         seq=df.iloc[i:i+SEQ][["open","high","low","close","volume"]].values

#         target=int(df["close"].iloc[i+SEQ+10] > df["close"].iloc[i+SEQ])

#         X.append(seq)
#         y.append(target)

#     return torch.tensor(X).float(),torch.tensor(y)


# df=load_all()

# X,y=create_sequences(df)

# model=TransformerModel()

# criterion=nn.CrossEntropyLoss()

# optimizer=torch.optim.Adam(model.parameters(),lr=0.001)

# for epoch in range(10):

#     optimizer.zero_grad()

#     output=model(X)

#     loss=criterion(output,y)

#     loss.backward()

#     optimizer.step()

#     print("epoch",epoch,"loss",loss.item())

# torch.save(model.state_dict(),"transformer_model.pth")

# print("Transformer model trained")


import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import torch
import torch.nn as nn
import pandas as pd
import numpy as np

from torch.utils.data import DataLoader, TensorDataset
from data.dataset_loader import load_all


SEQ = 100


class TransformerModel(nn.Module):

    def __init__(self, input_dim=5):

        super().__init__()

        encoder_layer = nn.TransformerEncoderLayer(
            d_model=input_dim,
            nhead=1,
            batch_first=True
        )

        self.encoder = nn.TransformerEncoder(
            encoder_layer,
            num_layers=2
        )

        self.fc = nn.Linear(input_dim, 2)

    def forward(self, x):

        x = self.encoder(x)

        x = x.mean(dim=1)

        return self.fc(x)


def create_sequences(df):

    X = []
    y = []

    for i in range(len(df) - SEQ - 10):

        seq = df.iloc[i:i+SEQ][["open","high","low","close","volume"]].values

        target = int(df["close"].iloc[i+SEQ+10] > df["close"].iloc[i+SEQ])

        X.append(seq)
        y.append(target)

    # convert list → numpy first (important for speed & memory)
    X = np.array(X)
    y = np.array(y)

    return torch.tensor(X).float(), torch.tensor(y)


# Load dataset
df = load_all()

# Create sequences
X, y = create_sequences(df)

print("Dataset shape:", X.shape)

# Create DataLoader
dataset = TensorDataset(X, y)
loader = DataLoader(dataset, batch_size=32, shuffle=True)


# Model
model = TransformerModel()

criterion = nn.CrossEntropyLoss()

optimizer = torch.optim.Adam(model.parameters(), lr=0.001)


# Training loop
for epoch in range(10):

    total_loss = 0

    for batch_X, batch_y in loader:

        optimizer.zero_grad()

        output = model(batch_X)

        loss = criterion(output, batch_y)

        loss.backward()

        optimizer.step()

        total_loss += loss.item()

    print("epoch", epoch, "loss", total_loss)


# Save model
torch.save(model.state_dict(), "transformer_model.pth")

print("Transformer model trained")