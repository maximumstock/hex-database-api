# hex-database-api

A REST-like node.js api to provide JSON data about cards, equipment, boosters, sets, etc. for the HEX TCG with data parsed from games files by **doc-x** for his [search engine](http://doc-x.net/hex/).
It only exposes one endpoint which is `/objects`, which can be used to either obtain all data at once or post more complex search queries to.

## Properties

Each 'object' (may it be a card, piece of equipment, etc.) has the following attributes, sorted by data type. Most of them are searchable.

##### Strings

* `name` - The name of the object (eg. ***Vampire King***).
* `text` - The description of the object in HTML (eg. ***Your <b>Zodiac Divinations</b> have, &quot;The top three cards of each opposing champion&apos;s deck get cost +[(1)].&quot;***).
* `uuid` - The (HEX) internal unique id of the object (standard 36 byte uuid eg. ***4848068e-15fd-4f1d-8009-c136d9821a6d***).
* `rarity` - The rarity of the object (eg. ***Legendary*** or ***Promo*** but also values such as ***Non-Collectible***).
* `faction` - The faction of the object (eg. ***Underworld***, ***Aria***, ***None*** or ***''*** (empty string)).
* `sub_type` - The subtype of the object, such as races or professions.
* `set_number` - The number/short name of the set the object belongs to.

##### Integers

* `atk` - The attack value of the object, see troops.
* `health` - The health value of the object, see champions.
* `cost` - The cost of the object, see cards.
* `socket_count` - The quantity of sockets the object has, see cards.

##### Arrays
All these values are composed of alphabetically sorted string/object arrays.

* `type` - The type of the object (eg. ***["Artifact"]*** for a normal Artifact or ***["Artifact", "Troop"]*** for an Artifact troop).
* `color` - The colors of the object (eg. ***["Diamond", "Ruby"]***)
* `threshold` - The treshold(s) of the object, for example:


    [
        {
            "shard": "Diamond",
            "quantity": 2
        }, {
            "shard": "Blood",
            "quantity": 2
        }
    ]

## Searchable
Below you can find a list of all searchable properties and examples. Each example shows which payload was `POST`ed to `/objects/search` and the resulting JSON response. Depending on the data type of the property you can specify more or less complex queries.

##### Strings
`name` and `sub_type` are searched for by looking for objects whose `name`/`sub_type` contain the value you provide. Those searches are case-insensitive while the rest are just simple lookups.

* `name`
* `sub_type`
* `faction`
* `rarity`
* `set_number`

##### Integers
These properties support a wider variety of searches. You can either search for exact values (like all objects with `atk` = 10) but also specify value ranges. Ranges can be specified with an object containing one or more of ***lt*** (less than), ***gt*** (greather than), ***lte*** (less than equal) or ***get*** (greater than equal)

* `atk`
* `health`
* `cost`
* `socket_count`

Examples:

All objects with `atk` of 10

    {
        "atk": 10
    }

All objects with `cost` between 3-6 and `atk` of 5

    {
        "cost": {
            "lte": 6,
            "gte": 3
        },
        "atk": 5
    }

##### Arrays

* `type`
* `color`
* `threshold`
