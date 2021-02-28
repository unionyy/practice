import matplotlib.pyplot as plt
import json

img = plt.imread("rift.png")
fig, ax = plt.subplots()
ax.imshow(img, extent=[0, 14733, 0, 14851])

for i in range(4):
    file = open(f'timeline{i}.json')
    frames = json.load(file)['frames']

    
    count = 0
    for frame in frames:
        count += 1
        for j in range(1, 11):
            pos = frame['participantFrames'][str(j)].get('position')
            if pos:
                ax.plot(pos['x'], pos['y'], marker='o', color=f'#{((i+1)*(j+1)*1234567%1000000):06d}')

        # if count == 2:
        #     break

plt.show()