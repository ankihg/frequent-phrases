# Frequent phrases

## Solutions

## Performance


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


## Run
To run tests
```
mocha
```

To add test file
* Add `.txt` file to `./test/resources/`
* Add filename and expected output to `resources` structure in `./test/test.js`
