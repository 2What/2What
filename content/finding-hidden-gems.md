---
title: Finding Hidden Gems: Datamining the Geometry Dash Servers to Uncover Forgotten Levels
description: Using unconventional server requests and comment history endpoints to locate and archive unrated Geometry Dash levels without manual review.
date: 2026-04-05
tags: [geometry-dash, datamining, python, reverse-engineering, archival]
---

# Finding Hidden Gems: Datamining the Geometry Dash Servers to Uncover Forgotten Levels

---

## Introduction

If you're reading this, you're likely already aware of at least some of the inner workings of the Geometry Dash client or server. It's become something of a well-known fact that the Geometry Dash server has no open API for external use beyond the game client itself. Thus, using external libraries within Rust or Python has become standard for fetching data from Geometry Dash without dealing with manual response parsing.

For the scope of this project, I stuck to raw requests in Python, as I only needed two specific endpoints.

### Endpoints Used

**`getGJCommentHistory`**

The first, endpoint is `getGJCommentHistory`. This endpoint is straightforward — it fetches a list of comments from a specific user via `playerID`, and results can be sorted by recency or most-liked.

**`getGJLevels21`**

The second endpoint is `getGJLevels21`, which has a plethora of options for querying the server for levels without downloading all associated level data. Within this project, the main parameter changed was the search type. The `type` parameter has 22 filters available, of which I used types `26` and `18`.

{% callout type="note" %}
Neither of these endpoints is officially documented. Their behavior has been reverse-engineered by the Geometry Dash community over time.
{% /callout %}

---

## Fetching the Comments

With our two endpoints in hand, the next question is: whose comments do we actually pull? This is an interesting problem. Do you target the best creators because they may have encountered the most levels, or the best players because they've beaten so many? My approach was to use the Geometry Dash moderators list. This group has already been tasked with finding the best levels, making them an ideal starting point.

Conveniently, the list of all current and past moderators is publicly available at [geometrydashmoderators.jimdofree.com](https://geometrydashmoderators.jimdofree.com/home/gd-moderators-list/). From there, the next step is obtaining each moderator's `playerID` to pass to `getGJCommentHistory`. While this can be fetched via another server request, making excessive requests isn't great for avoiding rate limits, so I opted to manually pull a list of `playerID`s once from [GDBrowser.com](https://gdbrowser.com) and save them locally to go through.

### Making the Request

With a list of player IDs ready, fetching comments for a given user is straightforward. Here's a simple example using longtime moderator and talented creator, Ryder:

```python
import requests

# Fetch Ryder's most recent page of comments
data = {
    "userID": 3935672,  # Ryder's player ID
    "page": 0,
    "mode": 0,          # sorted by recency
    "secret": "Wmfd2893gb7"
}

req = requests.post("http://boomlings.com/database/getGJCommentHistory.php", data=data)
print(req.text)
```

To fetch larger histories, you'd iterate through a number of pages and abstract this into a  function. Keep in mind that each page is a separate request, so it's probably best to not put a huge strain on the server by asking for too many at once.

### Parsing the Response

The response contains a lot of information, but the only fields we care about are:

- **Key `1`** — level ID
- **Key `2`** — comment content (base64 encoded)
- **Key `9`** — comment age

The comment content is encoded with base64, so deal with that. After decoding, you're left with an easy-to-store list of comments, level IDs, and comment ages to work with.

{% callout type="warning" %}
At the time this script was originally written, comment scraping worked regardless of a user's privacy settings. This has since been amended, which reduces the practicality of this approach somewhat, but it's good for player privacy.
{% /callout %}

---

## Fetching the Levels

At this point we have a list of level IDs, but not actual level data. For all we know, half of them could be deleted or unlisted. We could query `getGJLevels21` with each ID individually, but that's unnecessary strain on the server. This is where the `type` parameter becomes absolutely goated.

**Type `26`** allows you to supply a list of up to 100 IDs in a single request, and the server returns metadata for all levels that currently exist, with only one request. Here's a simplified version of the request:

```python
def fetch_levels(ids):
    response = requests.post(
        "http://www.boomlings.com/database/getGJLevels21.php",
        data={"str": ",".join(ids), "type": "26", "secret": "Wmfd2893gb7"}
    )
    levels = []
    for chunk in response.text.split("#")[0].split("|"):
        pairs = chunk.split(":")
        fields = dict(zip(pairs[::2], pairs[1::2]))
        levels.append({
            "id":        fields.get("1"),
            "name":      fields.get("2"),
            "downloads": fields.get("10"),
            "length":    fields.get("15"),
            "stars":     fields.get("18"),
        })
    return levels
```

This returns a list of dict objects representing each level. The actual response object contains dozens more properties, but for our filtering purposes these five are sufficient. With `stars` (key `18`) we can identify unrated levels, and with `length` (key `15`) we can filter for full-length levels rather than snippets. Other keys, like `objects` (key `45`)  and `editor time` (key `46`) might also be useful when trying to find actually completed levels.

---

### The Grand Reveal

By joining this level data with our earlier comment list, we can also see what the moderator who left the comment actually said about the level. If the comment was negative, that level can be likely be ignored, leaving us with a specialized list of levels to actually look into.

So, where did this get us? Actually pretty far, about a year and half ago I started a shortlived YouTube channel to show the results of this method. I did wind up finding quite a few gems, my personal favorite being *Monsters II* by - and the entire catalog of Kreed, who somehow has no rates after multiple really cool levels. You can find the few videos I did upload at [Level Catalog](https://www.youtube.com/@LevelCatalog), which also includes a few other oddities. Maybe some day I'll get back to uploading over there. 

--- 

### Additional Details

If you remember way earlier in the post I mentioned a type besides the list query, that type being `18`. This was internally considered the similar search at the time of making the original script. As of now it is seemingly deprecated. Originally from what I remember, it would find levels that had the same song, length, and position chronologically. Sometimes this resulted in an interesting find from the same era, but now it's totally gone. I figured that I should still include it here just because it was at least somewhat interesting.
