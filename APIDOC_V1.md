## Properties

Each 'object' (may it be a card, piece of equipment, etc.) has the following attributes, sorted by data type. Most of them are searchable. All string values in any of the data structures sent to the search endpoint should be case-sensitive.

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
* `health` - The health value of the object, see troops/champions.
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

---

## API Endpoints

### Property values

To get an idea what values each property described above can have and also to have a dynamic source to look it up there is a dedicated endpoint to explore the data. All results of your query are sorted by the chosen property in ascending order.

* HTTP method: `GET`
* URL: `/v1/objects/properties/:propertyName` - with `:propertyName` being the property you want to know all distinct values for

**Example:**

`GET /v1/objects/properties/rarity` yields:

    [
        "Champion",
        "Common",
        "Epic",
        "Legendary",
        "Non-Collectible",
        "Promo",
        "Rare",
        "Uncommon"
    ]

### Search

* HTTP method: `POST`
* URL: `/v1/objects/search`

Below you can find a list of all searchable properties and examples. Each example shows which payload was `POST`ed to `<version>/objects/search` and the resulting JSON response. Depending on the data type of the property you can specify more or less complex queries. All results of your search are sorted by the name of the object in ascending order.

##### Strings
`name` and `sub_type` are searched for by looking for objects whose `name`/`sub_type` contain the value you provide. Those searches are case-insensitive while the rest are just simple lookups.

* `name`
* `sub_type`
* `faction`
* `rarity`
* `set_number`

##### Integers
These properties support a wider variety of searches. You can either search for exact values (like all objects with `atk` = 10) but also specify value ranges. Ranges can be specified with an object containing one or more of ***lt*** (less than), ***gt*** (greather than), ***lte*** (less than equal) or ***get*** (greater than equal). The wider operand will be used, which means if you specify ***lte*** AND ***lt***, ***lte*** will be used.

* `atk`
* `health`
* `cost`
* `socket_count`

**Examples:**

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


**Examples:**

All objects that are **Artifacts** and **Troops**

    {
        "type": ["Artifact", "Troop"] // these are case-sensitive but ["Troop", "Artifact"] works too
    }

All objects with thresholds: Wild 1, Ruby 1

    {
        "threshold": [{
            "shard": "Wild", // same here, these array elements can be sorted differently
            "quantity": 1
        }, {
            "shard": "Ruby",
            "quantity": 1
        }]
    }
