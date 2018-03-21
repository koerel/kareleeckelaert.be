+++
title = "On Chromecasts and Slack"
description = "What's playing at the office"
tags = [
    "chromecast",
    "raspberry pi",
    "slack",
    "music"
]
date = "2017-06-01"
categories = [
    "cryptography",
    "technology",
    "music"
]
+++

# On Chromecasts and Slack

## Background

Okay, first a little background. We - at [Bagaar] (http://bagaar.be) - are involved in all things digital. By nature many of us are interested in discovering new things, that includes music, lots of music. Therefore we had built a Slack integration that checked the 'current DJ' at the office Last.fm scrobbles and posted them to a Slack channel for all to see.
This worked fine while we were using an Apple Airport and Airplaying our tunes with Spotify.

## The problem

A while back however we decided to swap our beloved Airport Express for a Chromecast Audio, for reasons unknown to me.
As some of you might know, tracks that are being casted can't be scrobbled, so our system was now broken.

## Almost there...

Being developers and all, we obviously saw this as a challenge rather than a problem. I knew the Chromecast had an API, so I started digging.
Some Googling later, I found a nice JavaScript library - [castv2] (https://github.com/thibauts/node-castv2) - that did just what I wanted.
It can fetch all kinds of data from the Chromecast: Artist, Track, Album, Spotify URI, etc... but there was one issue left. The Chromecast sits in our internal network and we're not too keen on opening ports into our network when not absolutely necessary.

## WebSockets to the rescue!

In the office we have a Raspberry Pi connected to a television doubling as office dashboard. It seemed the perfect candidate to host our music tracker.
On the Pi we decided to run a little Node.js application that connects to a WebSocket server and waits for commands. Now whenever someone uses the Slack command a webhook on a server is called that sends a message to the Pi over the websocket, which then in turn fetches and parses the Chromecast data and sends it into the originating Slack channel.
Everybody happy!