# ChITTER

Character Information Toolbox, Totally, Except React

## Not ready for primetime quite yet...

This project started more as a way to familiarize myself with React than
as an attempt to rewrite all of ChIT in React since I considered that a
"ludicrous undertaking" when I was starting.

Over the course of development I realized that it was much more pleasant
to work on than ChIT for a variety of reasons (mostly involving old code
that updating to be less of a pain to interact with would be a project of
almost this scale anyway), so it will be a replacement for ChIT eventually.

As for when that will happen, I do not know, I work on this in occasional
bursts in my spare time when I feel like it, so it isn't exactly coming
along rapidly, but it will be caught up eventually.

It's not quite there yet, but it's getting close enough that it's basically
ready for early beta testing. If you want to try it out, feel free to install,
and please issues here, just uhh, expect a fair number of them for now, and
for it to be less fully fleshed out than ChIT.

## Installation

```
git checkout soolar/ChITTER release
```

You can then activate ChITTER from the relay scripts menu in the relay browser.

## Project Setup

```
yarn install
```

## Building

```
yarn build
```

And then you "just" symlink the KoLmafia files in to the appropriate places in your mafia folders.
I'd provide more detailed instructions, but it will be handled completely differently once it's
ready for public use, so there's not much point.

If on Linux (and maybe Mac? I'm not sure tbh), you can instead run

```
yarn buildlink
```

and it will take care of the symlinking for you.
