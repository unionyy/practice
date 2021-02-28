import matplotlib.pyplot as plt
import json

img = plt.imread("rift.png")
fig, ax = plt.subplots()
ax.imshow(img, extent=[0, 14733, 0, 14851])

for i in range(0, 4):
    file = open(f'timeline{i}.json')
    frames = json.load(file)['frames']

    
    posX = [[], [], [], [], [], [], [], [], [], []]
    posY = [[], [], [], [], [], [], [], [], [], []]

    count = 0
    for frame in frames:
        count += 1
        for j in range(1, 11):
            pos = frame['participantFrames'][str(j)].get('position')
            if pos:
                posX[j-1].append(pos['x'])
                posY[j-1].append(pos['y'])
        if count == 5:
            break

    for j in range(1, 11):
        ax.plot(posX[j-1], posY[j-1], marker='o', linestyle='--', color=f'#{((i+1)*(j+1)*1234567%1000000):06d}')


plt.show()