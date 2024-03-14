---
title: Developing TiltKart - Part 1
toc: true
---

# Introduction
___

<!-- excerpt-start -->
One of my [previous posts]() discussed adding TiltFive to a Unity project. I have been adding to and expanding on that Unity project to make a small reference game called "TiltKart". Putting together this little racing game has been hugely educational, and I wanted to share what I've learned.
<!-- excerpt-end -->

# Unity - Easy To Learn...
___

First of all, I think it's really easy to get _started_ with Unity. In my experience so far that also builds up a false sense of security pretty quickly! My personal coding projects tend to be overengineered as I bog down in details on how they should be structured and planned. Setting up my "first draft" of TiltKart was super easy, taking only a few days and even allowing me to generate initial builds for Windows and Android devices. That's awesome, right?

# ...Difficult To Master
___

Well, to be fair, it _is_ awesome. The little sample was ready in time for [Augmented World Expo](https://www.awexr.com/), so I got to show it off to the TiltFive team directly! It also gave me time to throw it up in a [Github repository](https://github.com/seii/tiltkart) and file some issues and PRs against my own repo. From there, time passed...

Almost a year later, I was able to dig in and start trying to fix some of the known issues which remained. The major pain point that I got stuck on was related to remaking the UI. See, TiltFive as a holographic display doesn't necessarily have the visual fidelity that a full desktop PC does. As a result, it works better to think of TiltFive visual designing as if you were making a holographic mobile game instead of a high-end PC or VR game. My initial build had bypassed a ton of UI elements in favor of just having something ready to play, so almost all navigation through menus and such was originally done on the PC or mobile device actually running the game instead of allowing the user to view choices through the glasses and use their peripheral of choice.

# Overlay Vs World Space
___

In trying to add the existing PC-based UI elements back in, I had to confront the two Render Modes that are [overlay](https://docs.unity3d.com/2021.3/Documentation/Manual/class-Canvas.html) and [world space](https://docs.unity3d.com/2020.1/Documentation/Manual/HOWTO-UIWorldSpace.html) in Unity. "Screen Space - Overlay" basically means "whatever the screen size and/or ratio is, this game magically fills it." World space, by contrast, sets elements in fixed sizes and positions. It's more flexible, but requires a lot more fine-grained detail on where UI elements are placed. TiltFive, in order to allow many of their 3D tricks, require the use of world space for the glasses to properly render scenes. So... I cheated! The UI elements were simple enough in TiltKart that I cloned the overlay UI, converted it to world space, and created a script to switch which one was active based on whether TiltFive glasses are detected. It's likely possible to just convert the non-TiltFive interface to world space and use it for both, but I wasn't looking forward to that amount of manual UI work.

When I did have to face manual UI work for the world space UI, what I found to be effective was setting up the board, donning the glasses, and tweaking UI settings live in the Unity Editor while the game was running in Play Mode. This allowed me to directly observe the results on the board, even if it's a bit awkward to constantly glance between my computer screen and the board at times. For the most part, this worked and I was finally able to start displaying existing items like the "current" and "best lap" timers through the glasses. The individual lap times went quickly as well, since they were inside a container that I could use to control position and scaling.

## Suddenly, Scriptables

Let me pause a moment and admit right away that I'm fairly new to using the Unity Engine. There's a _lot_ I still have to learn about using the program, so it's not truly a surprise when I find something strange and different. With that said, part of the UI which was used for showing notifications (i.e. "One Lap Left") used [Scriptable Objects](https://docs.unity3d.com/Manual/class-ScriptableObject.html). I had never seen these before! The idea is pretty cool, and I'm sure they're very useful... but whoever this sample's creator was, they chose to pre-generate Scriptable Objects, mark them as inactive in a placeholder container, then set the text on them and move them somewhere more visible when they were ready to be used. This meant that I had no way to control their positioning, as I would have needed to alter the scripts which generated the objects in order to affect how they were created. It's not a problem for overlays, but it definitely put me in a bind for world space!

## Flexibility Is Key

I chose to handle this by once again allowing the TiltFive UI to differ from the non-TiltFive UI. I left the Scriptable Objects intact, but for TiltFive's UI I set the placeholder parent object where these notifications would be displayed as "inactive". This way, existing scripts would still fire to create and move Scriptable Objects, but they wouldn't show in the TiltFive UI. From there, I created a separate parent as a sibling to the existing placeholder. In this sibling I copied the prefab for notifications, unpacked it so I wouldn't be altering any existing prefabs, and went back to manual world space editing. This new object allowed me to freely position notifications, but it wasn't yet hooked into anything which could update it or change its text.

## Event-ful

During research on general Unity workflows, I had stumbled across the idea of [Events](https://docs.unity3d.com/ScriptReference/Events.UnityEvent.html) and [Actions](https://docs.unity3d.com/ScriptReference/Events.UnityAction.html). Apparently they're mostly a wrapper for C# [Delegates](https://learn.microsoft.com/en-US/dotnet/csharp/programming-guide/delegates/), but I was also relatively new to C# and hadn't encountered the concept before. 
<br />
<aside><h3>Recommendation for learning Events and Actions</h3>
<div>
   <p>Personally, the site I found the easiest to understand for learning to implement Events and Actions was https://gamedevbeginner.com/events-and-delegates-in-unity/#actions</p>
</div>
</aside>

While looking around on how I could get my manual notification object to properly update, I found that notifications were already listening to an `onUpdateObjective` Action. I tweaked the Action's signature slightly to be `static`, as that would allow other classes to subscribe as well. (This also meant I had to update a few existing references to take that into account.) Now I could create a small script to listen to this Action, attach it to my custom notification container, and update my custom notification whenever the Action triggered. Success!

At this point I had a custom object and its children that were already positioned and scripted to accept updates properly. I saved the tree of objects as its own prefab so it could be used in other scenes later.

# To Be Continued...

I've rambled on a bit already, so I'll stop here for this entry. TiltKart is still under active development, so I foresee at least one more of these entries coming up in the future.