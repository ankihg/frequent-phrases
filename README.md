# Frequent phrases

## Solutions
### Solution One
The goal with this solution is to have as simple a counting process as possible and leave the complicated work, like removing subphrases, to the end.

The cleanup work to be done after counting ends up being quite complicated and extremely inefficient, as it requires iterating through all the phrases several times.

I don't recommend this approach.

#### Pseudocode
```
generate all phrases from MIN_LENGTH to MAX_LENGTH
iteratate thru all phrases to gather phrase counts, collecting phrases once determined repeated
filter out subphrases of repeated phrases
sort remaining phrases by counts
return top N
```

### Solution Two
The goal with this approach is to avoid collecting subphrases of repeated phrases so they don't have to be filtered out at the end.

This requires visiting longer phrases first, so you know what subphrases to avoid collecting.

The `_generateGrams\` helper function handles this by returning an array (`inDescLength`) with longer phrases first. This will be the order that we iterate through the phrases in.

A possible improvement to the efficiency would be, at phrase generation time, to build a lookup from a phrase to its subphrases. That way, when you see that a phrase has repeated you can lookup which subphrases to delete from the valid phrases lookup, instead of regenerating the subphrases for that phrase, as the algorithm is currently doing. This would require writing a custom ngram generation function, sacrificing maintainability, so I've decided not to implement.

#### Pseudocode
```
gen all phrases from MIN_GRAM to MAX_GRAM
build hash of valid phrases
build phraseOrder array that has phrases by length, longests first
for (phrase in phraseOrder)
    if (phrase not in validPhrases)
        countsByGram[gram] = countsByGram[gram] || 0
        countsByGram[gram]++
        if (countsByGram[gram] > 1)
            gen subphrases of all length for phrase
            delete each subphrase from validPhrases
```

## Performance
The following is JSON showing the performance of the solutions on test resources. The top-level keys are filenames found in `./test/resources/`.
```
{
    "brown-fox": {
        "numWords": 49,
        "expect": {
            "include": [
                "the quick brown fox jumped over",
                "the lazy dog"
            ],
            "exclude": [
                "the quick brown",
                "quick brown fox",
                "the quick brown fox jumped",
                "the lazy"
            ]
        },
        "solution1": {
            "output": [
                "the quick brown fox jumped over",
                "the lazy dog"
            ],
            "runtime": 2
        },
        "solution2": {
            "output": [
                "the quick brown fox jumped over",
                "the lazy dog"
            ],
            "runtime": 2
        }
    },
    "lazy-dog": {
        "numWords": 74,
        "expect": {
            "include": [
                "the quick brown fox jumped over",
                "over the lazy dog",
                "the quick fox"
            ],
            "exclude": [
                "the lazy dog",
                "the quick brown fox"
            ]
        },
        "solution1": {
            "output": [
                "the quick brown fox jumped over",
                "over the lazy dog",
                "the quick fox"
            ],
            "runtime": 2
        },
        "solution2": {
            "output": [
                "the quick brown fox jumped over",
                "over the lazy dog",
                "the quick fox"
            ],
            "runtime": 2
        }
    },
    "sentence-division": {
        "numWords": 49,
        "expect": {
            "include": [
                "the quick brown fox jumped over",
                "peeved to be"
            ]
        },
        "solution1": {
            "output": [
                "the quick brown fox jumped over",
                "peeved to be"
            ],
            "runtime": 1
        },
        "solution2": {
            "output": [
                "the quick brown fox jumped over",
                "peeved to be"
            ],
            "runtime": 1
        }
    },
    "nytimes-oped": {
        "numWords": 1075,
        "expect": {
            "include": [
                "trump ’ s",
                "it ’ s"
            ]
        },
        "solution1": {
            "output": [
                "trump ’ s",
                "it ’ s",
                "to do what",
                "’ s leadership",
                "that many of",
                "the white house",
                "the president ’ s",
                "in private , ",
                "of the administration",
                "do what we can to"
            ],
            "runtime": 22
        },
        "solution2": {
            "output": [
                "it ’ s",
                "trump ’ s",
                "the work of the",
                "that many of",
                "do what we can to",
                ",  he has",
                "the president ’ s",
                "the white house",
                "to do what",
                "in private , "
            ],
            "runtime": 19
        }
    },
    "perf-test": {
        "numWords": 39729,
        "expect": {
            "include": [
                "down the river"
            ]
        },
        "solution1": {
            "output": [
                ",  when the",
                ",  as they",
                ",  from the",
                ",  and his",
                "down the river",
                "in the evening",
                ",  in which",
                ",  for the",
                "the fort , ",
                "as it is"
            ],
            "runtime": 2470
        },
        "solution2": {
            "output": [
                ". ”   the",
                ",  with the",
                ",  as they",
                ",  when the",
                ",  from the",
                ",  and his",
                ",  for the",
                ",  but the",
                ",  in which",
                "down the river"
            ],
            "runtime": 497
        }
    },
    "perf-test-2": {
        "numWords": 75722,
        "expect": {
            "include": [
                "the poet ’ s",
                "o ’ er the",
                "’ d to"
            ]
        },
        "solution1": {
            "output": [
                "’ d to",
                "o ’ er the",
                ",  and his",
                ",  or the",
                "the poet ’ s",
                ",  as he",
                ",  with the",
                ",  and which",
                ",  and in",
                ",  as a"
            ],
            "runtime": 27358
        },
        "solution2": {
            "output": [
                "’ d to",
                ". _ ”  ",
                "o ’ er the",
                ",  or the",
                ",  and his",
                ",  as a",
                ",  and in",
                ",  as he",
                ",  and which",
                "the poet ’ s"
            ],
            "runtime": 1065
        }
    }
}
```


## Text handling

### Punctuation
I used the `WordPunctTokenizer` from `NaturalNode / Natural` to tokenize text before generating phrases. This treats
punctuation, like commas and quotation marks, as their own tokens.

```
'I love cats, sir' => ['I love cats', 'love cats ,', 'cats , sir']
```

I decided to do this rather than excluding them because punctuation can represent subtle semantic differences.

I also decided that punctuation should not be included by grouping
with the word it's attached to because the punctuation is not acting on the level of that word.

I would consider using a different tokenizer to treat words split by an apostrophe as one word because it leads to insignificant three letter phrases like `it ' s`. Also, because some phrases split at the apostrophe don't have meanings on their own, like `wasn` in `wasn ' t`.


### Capitalization
Capitalization is handled by lowercasing the entire document string before processing. My prime motivation in lowercasing is to remove the capitalization of the first letter of each sentence because it has no semantic value. For other occurrences of capitalization, particularly proper nouns, I could see handling it either way. Here I have treated proper nouns the same regardless of capitalization.


## Run
To run tests
```
mocha
```

To add test file
* Add `.txt` file to `./test/resources/`
* Add filename and expected output to `resources` structure in `./test/test.js`
