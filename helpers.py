import os
import re
import json

from collections import Counter

NUM_TAGS_RETURNED_LIMIT = 20

def get_hashtags_from_search(results):
    """Extract hashtags from Tweepy search results and tally the number
    of times each tag occurs
    """
    hashtags = []

    for result in results:
        try:
            hashtags += re.findall(r"#(\w+)", result.text)
        except(AttributeError):
            hashtags += re.findall(r"#(\w+)", result['text'])

    hashtag_counts = Counter(hashtags).most_common(NUM_TAGS_RETURNED_LIMIT)

    return json.dumps(hashtag_counts)