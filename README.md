# hex-database-api

A REST-like node.js api to provide JSON data about cards, equipment, boosters, sets, etc. for the HEX TCG with data parsed from games files by **doc-x** for his [search engine](http://doc-x.net/hex/).
It only exposes one endpoint which is `/objects`, which can be used to either obtain all data at once or post more complex search queries to.

Each 'object' (may it be a card, piece of equipment, etc.) has the following attributes, sorted by data type:

##### Strings

* `name` - The name of the object (eg. ***Vampire King***).
* `text` - The description of the object in HTML (eg. ***Your <b>Zodiac Divinations</b> have, &quot;The top three cards of each opposing champion&apos;s deck get cost +[(1)].&quot;***).
* `uuid` - The internal unique id of the object (standard 36 byte uuid ***4848068e-15fd-4f1d-8009-c136d9821a6d***).
* `rarity` - The rarity of the object.
* `faction` - The faction of the object.
* `sub_type` - The subtype of the object, such as races or professions.
* `set_number` - The number/short name of the set the object belongs to.

##### Integers

* `atk` - The attack value of the object, see troops.
* `health` - The health value of the object, see champions.
* `cost` - The cost of the object, see cards.
* `socket_count` - The quantity of sockets the object has, see cards.

##### Arrays
All these values are composed of alphabetically sorted string arrays.

* `type` - The type of the object (eg. ***["Artifact"]*** for a normal Artifact or ***["Artfact", "Troop"]*** for an Artifact troop).
* `color` - The colors of the object (eg. ***[])
* `threshold`
