Just playing about with the Speech Recognition engine now in Chrome.

![](http://i.imgur.com/PTWqi.png)

This is just a proof of concept. We're retreiving a delayed continuous transcription stream from the browser. We're then just checking if the first 2 words match what we're expecting.

Soon, [SpeechGrammar](https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#speechreco-speechgrammar) will be implemented in Chrome. With this, accuracy will be greatly improved as we can tell the Speech Recognition engine exactly what commands we're expecting.
For example, with commands, the Speech Recognition has some idea of what words to expect, so can weight the results in that favour. Without it, 'Add Room' could be mis-interpreted as something like 'Add Broom' etc.
