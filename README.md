![game-logo Kopie](https://github.com/linssenste/dalli-dalli/assets/13923365/0a553060-ab08-4a70-8e63-e22b05bf4151)



This is the repository of the geography game [Dalli-Dalli](https://dalli-dalli.com).

## But Why?

So, I am an passionate GeoGuessr Player and love little geography games. One day my dad asked me whether I could make a little game called Dalli-Klick for his friends birthday. Dalli Klick is a game from a tv show called Dalli-Dalli in the late 70s. Obviously I did not know it or hear about it. When I looked at it, I was like: this could be a great geography game. Guessing the location based on little clues may be fun. And that’s it.
Fun fact: I never did the Dalli-Klick for the party, they ended up using Powerpoint instead.

## Game Concept

An image, representing a Point of Interest (POI) on the map, is hidden by randomly sized and placed shapes. The shape may be a rectangle, a hexagon, a randomly sized triangle or a voronoi shape. With each iteration, a shape is removed, revealing more information about the image. The magic is always in the detail!

Each game consists of five individual rounds where you have the potential to earn up to 5000 points. The task is to locate the POI on the map. The closer the guess and the less of the image is uncovered (visibility), the higher the round score. A perfect score is definitely possible!

<img width="1440" alt="Bildschirm­foto 2023-07-29 um 14 47 12" src="https://github.com/linssenste/dalli-dalli/assets/13923365/bd65532d-d006-4ec1-b9d1-33852c120166">

<img width="1440" alt="Bildschirm­foto 2023-07-29 um 14 47 29" src="https://github.com/linssenste/dalli-dalli/assets/13923365/2a762e65-d9a3-4535-a126-2784e5722597">


## Embrace the Challenge!

1. **Level 1:** Starting off easy with high-definition images of globally recognized landmarks.

2. **Level 2:** Moving into slightly unfamiliar territories with images of common, yet not-so-famous places.

3. **Level 3:** Stepping up the game with images from challenging locations and hidden gems waiting to be identified.

4. **Level 4:** The ultimate challenge with a random blurry Google Street View image from around the world. The heading is random - there may be walls.

From Levels 1 to 3, all images are meticulously selected, offering various perspectives on each location. With high-quality images, more details, different lighting, the guessing game takes on a whole new dynamic. Give it a try and test those geoguessing skills!

## Is a perfect score even possible?

Scoring in this game follows a clear-cut methodology, bearing resemblance to Geoguessr with a maximum of 5000 points per round. The points a player receives are contingent upon the accuracy of their guess and the visibility of the given image. A distance score, up to 4000, reduces exponentially as the guess deviates from the exact location. A visibility score, with a 1000 cap, increases as image clarity decreases. When a guess is significantly off target, with a distance score below 10, no points are awarded. However, if a guess is highly accurate under low visibility, a perfect score of 5000 is attainable. The final score is the rounded sum of distance and visibility scores, making the pursuit of a perfect score an engaging challenge.

## Customization

The game allows a degree of customization for a more personalized experience. Naturally, the difficulty can be adjusted with different levels. Players also have the liberty to specify the number of shapes obscuring the image. The choice of shape type – triangle, rectangle, Voronoi, or hexagon – adds another dimension to the gameplay. Additionally, a timer can be set to dictate the rate at which shapes are removed. For those who prefer a hands-on approach, there's also a manual mode that lets players control the removal of shapes themselves.

<img width="1440" alt="Bildschirm­foto 2023-07-29 um 14 44 58" src="https://github.com/linssenste/dalli-dalli/assets/13923365/a03808dd-67d1-4393-9b83-1efa5abf95bd">


## Future Plans

The game is currently designed for desktop computers and is more fun on them. However, there is a more or less mobile version that works as well. This will have to be reworked in the future.

Other then that, those are the todos:
- [ ] fix resizing on konva stage
- [ ] fix overflow of hexagon shapes (too many shapes have to be rendered, resulting in some shapes to be outside of the image area)
- [ ] improve scoring function
- [ ] add more test cases

## Feedback

Your feedback is essential for the game's improvement. If you experience issues or have suggestions, please raise an issue. Those comfortable with the codebase are welcome to submit pull requests. Every contribution, large or small, is valued in refining the game for all players. Let's improve this game together! 🥳
