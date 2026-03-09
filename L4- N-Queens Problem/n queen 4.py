def solve_n_queens(n):

    cols = set()
    diag1 = set()   # r - c
    diag2 = set()   # r + c
    board = [-1] * n
    solutions = []

    def place(row):
        if row == n:
            solutions.append(board.copy())
            return

        for col in range(n):
            if col in cols or (row-col) in diag1 or (row+col) in diag2:
                continue

            board[row] = col
            cols.add(col)
            diag1.add(row-col)
            diag2.add(row+col)

            place(row+1)

            cols.remove(col)
            diag1.remove(row-col)
            diag2.remove(row+col)

    place(0)
    return solutions


def print_board(solution, n):
    for r in range(n):
        for c in range(n):
            if solution[r] == c:
                print("Q", end=" ")
            else:
                print(".", end=" ")
        print()
    print()


n = int(input("Enter board size: "))

solutions = solve_n_queens(n)

print("Total solutions:", len(solutions))
print("\nFirst solution:\n")

if solutions:
    print_board(solutions[0], n)