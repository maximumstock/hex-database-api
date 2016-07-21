### Documentation for version 1 (v1) of this API.

# Changelog

* 2016-07-20
  * Added `equipment_uuids` and `artist` to properties
  * Added `artist` to searchable properties

# API Endpoints

### Search through objects

* HTTP-Method: POST
* URL: `/v1/objects/search`

This endpoint lets you search for objects by specifying various parameters.
Below you can find a list of all searchable properties and examples.
All results of your search are sorted by the name of the object in ascending order.

**Strings**

`name` and `sub_type` are searched for by looking for objects whose `name`/`sub_type` contains the value you provide.
Those searches are case-insensitive, while the rest are simple lookups for matching strings.

* `name`
* `sub_type`
* `faction`
* `rarity`
* `set_number`
* `uuid`
* `artist`

**Integers**

These properties support a wider variety of searches.
You can either search for exact values (eg. all objects with `atk` = 10) but also specify value ranges.
Ranges can be specified with an object containing one or more of ***lt*** (less than), ***gt*** (greather than), ***lte*** (less than equal) or ***get*** (greater than equal).
The wider operand will be used, which means if you specify ***lte*** AND ***lt***, ***lte*** will be used.

* `atk`
* `health`
* `cost`
* `socket_count`

Examples:

To list all objects with `atk`-value of 10:

    {
        "atk": 10
    }

To list all objects with `cost` between 3-6 and `atk` of 5

    {
        "cost": {
            "lte": 6,
            "gte": 3
        },
        "atk": 5
    }

**Arrays**

* `type`
* `color`
* `threshold`

Examples:

To list all objects that are *Artifacts* and *Troops*

    {
        "type": ["Artifact", "Troop"] // this is case-sensitive but the order of the elements does not matter, so ["Troop", "Artifact"] works too
    }

To list all objects with thresholds: Wild 1, Ruby 1

    {
        "threshold": [{
            "shard": "Wild", // same here, these array elements can be sorted differently
            "quantity": 1
        }, {
            "shard": "Ruby",
            "quantity": 1
        }]
    }


### What do those properties mean?

* HTTP-Method: GET
* URL: `/v1/objects/properties/:propertyName`

To get an idea what values each property described above can have and also to have a dynamic source to look it up there is a dedicated endpoint to explore the data.
All results of your query are sorted by the chosen property in ascending order.

Examples:

If you want to know which different values the property `rarity` can have, try `GET /v1/objects/properties/rarity`, which yields:

    [
        "", // eg. Gems, Packs, Sleeves, etc.
        "Champion",
        "Common",
        "Epic",
        "Legendary",
        "Non-Collectible",
        "Promo",
        "Rare",
        "Uncommon"
    ]

## Disclaimer
The information presented through this API about HEX is copyrighted by Cryptozoic Entertainment. This project is not produced, endorsed, supported, or affiliated with Cryptozoic Entertainment. All code and data compromising this API is provided without warranty.
