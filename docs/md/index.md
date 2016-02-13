# General
This API serves static JSON data like names, sets, rarities and more for most of the cards, pieces of equipment, champions, mercenaries and everything else the game files include at that time. It is updated daily by parsing search results from doc-x' search engine, which you can find [here](http://doc-x.net/hex/).
As most of the time this API does not differentiate between cards and other types of things, the term 'objects' is used instead.
So whenever 'objects' are referenced in this documentation, it can be either a card, an item, a piece of equipment, etc.

Each object has a set of properties. Keep in mind that not all properties make sense for all types of objects. For example, a piece of equipment usually doesn't have `health` or a `cost` to play. To keep things simple, all types are stored the same way they are stored in the game files. Look below to find some JSON examples.

# What should it be used for?
Really anything that requires you to retrieve some extra information about things in HEX.
If you want to build some kind of searching frontend that lets a user filter champions or equipment, this API makes it easier for you to handle all the actual game data.

# How does it work?
By sending HTTP-Requests to defined URLs that can be found in the documentation for each API version, shown below.

# API Version Index
Here is a list of all currently available API versions.
* [v1](v1/index.html)

# Feedback
If you have any feedback, you can discuss it [here](https://forums.cryptozoic.com/showthread.php?t=43933) or contact me via [email](mailto:cwik@hexsales.net).

---

### Disclaimer
The information presented through this API about HEX is copyrighted by Cryptozoic Entertainment. This project is not produced, endorsed, supported, or affiliated with Cryptozoic Entertainment. All code and data compromising this API is provided without warranty.
