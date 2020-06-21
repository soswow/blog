---
title: Jetson Nano, Headless Ubuntu and Bluetooth troubles + solutions
date: 2020-06-21
layout: post.njk
collection: posts
tags: blog ubuntu Bluetooth "jetson nano"
---

Here, I will document some of the problems and solutions I've experienced over past days working with Jetsn Nano in headless mode trying to pair my Switch Joy-Con.

Problem #1 - VNC on Jetson Nano's Ubuntu 18.04
----------------------------------------------

First I need to set up remote desktop - VNC server. Just in case, pretty much.

[Jetson Nano's standard image](https://developer.nvidia.com/embedded/learn/get-started-jetson-nano-devkit#write) is an Ubuntu 18.04. If you google "vnc jetson nano" you will find [same instructions](https://raspberry-valley.azurewebsites.net/NVIDIA-Jetson-Nano/#remote-desktop-vnc) talking about modifying `/usr/share/glib-2.0/schemas/org.gnome.Vino.gschema.xml` file and running `glib-compile-schemas` after that. Plus, you will find [how to actually startup VNC server](https://forums.developer.nvidia.com/t/jetson-nano-vnc-headless-connections/77399/4?u=soswow) that is already pre-installed with bash script like this:
```bash
#!/bin/bash
export DISPLAY=:0
gsettings set org.gnome.Vino enabled true
gsettings set org.gnome.Vino prompt-enabled false
gsettings set org.gnome.Vino require-encryption false
/usr/lib/vino/vino-server &
```

It all works fine, except for the extremely small screen (800x600 by default). It was pretty hard to find a solution that was not an instruction to install a different implementation of VNC protocol server (like TightVCN, TigerVNC and other) but something that would make the screen bigger for what I already have.

The solution was to add this:
```
Section "Screen"
   Identifier    "Default Screen"
   Monitor        "Configured Monitor"
   Device        "Default Device"
   SubSection "Display"
       Depth    24
       Virtual 1280 800
   EndSubSection
EndSection
```
to the end of `/etc/X11/xorg.conf` and it magically worked giving me big enough virtual screen when connected via VNC client.

Problem #2 - Pairing Switch Joy-Cons Bluetooth controllers to Ubuntu
-----------------------------------------------------------

I want to use my Joy-Cons as controllers for my implementation of [Donkey Car](https://www.donkeycar.com/). For that, I need first to pair them with Jetson Nano. Since Jetson Nano doesn't have built-in Bluetooth device, I am using a USB dongle.

To pair Joy-Con with any device you need to put into pairing mode. There is a small round button in the middle of its side. Press it and hold for a bit until lights will start running up and down.

Now, you can use Ubuntu UI to do the pairing. There is nothing complicated in that. The question is how to do this via the command line (ssh).

What we will need is BlueZ, which is

> BlueZ is the official Linux Bluetooth stack. It provides, in its modular way, support for the core Bluetooth layers and protocols.

You can get it by installing `bluez-tools` with 
```bash
sudo apt install bluez-tools
```

Now you should be able to run `bluetoothctl` command, that will open own command line interface:

[![bluetoothctl interface]({{ site["baseurl"] }}/images/small/2020-06-21-1.jpg)]({{ site["baseurl"] }}/images/2020-06-21-1.png)

It took me a while to find an exact order of commands that you need to execute for everything to work. During all of the following instructions, Joy-Con lights should be running up and down. If they stop, just press and hold SYNC button again.

1. `agent on` - can be already on, but just in case.
2. `scan on`
3. Now, wait for your device to show up. For me, it is `[NEW] Device B8:78:26:19:C1:8C Joy-Con (R)`
4. `scan off` - now when we know it's MAC address we don't need to get spammed with other devices popping up.
5. `trust <YOUR DEVICE MAC>`
6. `pair <YOUR DEVICE MAC>`
7. It will pair, be connected for a bit and then disconnect.
8. `connect <YOUR DEVICE MAC>`
9. You prompt will change from `[bluetooth]#` to `[<YOUR DEV NAME>]#` (`[Joy-Con (R)]#` in my case)

Congratulation, now your device is paired and connected. You can go ahead and start talking to it. What took half a day for me is to find out, that `trust` command should go **BEFORE** `pair` and `connect`! Without it, I was getting an immediate disconnect right after `connect`.

Now, if you want to switch off your Joy-Con you can press SYNC button once. It will take a couple tens of seconds for `[CHG] Device B8:78:26:19:C1:8C Connected: no` be printed out and prompt change back to `[bluetooth]#`.

To get everything connected again, press any button on Joy-Con and wait for `[CHG] Device B8:78:26:19:C1:8C Connected: yes`. It's that easy. Well, almost. In case this doesn't press SYNC button once (not holding) and then press `R` or `SR` buttons.

While I was pulling my hair out trying to understand how to make my Joy-Cons properly I've labelled them all:

[![labeled Joy-Cons]({{ site["baseurl"] }}/images/small/2020-06-21-2.jpg)]({{ site["baseurl"] }}/images/2020-06-21-2.jpg)

Problem #3 - Python interface to interact with Joy-Cons
-------------------------------------------------------

Now, when Joy-Cons are paired and connected how can we communicate with them? Using Python, obviously. I found a [joycon-python library](https://github.com/tokoroten-lab/joycon-python) that promises just that.

The first roadblock was during installation of `hidapi` python library, that `joycon-python` depends on. So for now just install `pip install joycon-python pyglm` and we will deal with `hidapi` later. 

In `joycon-python` library instructions author says:
> You need cython-hidapi to use Bluetooth / HID connection in Python.
> 
> Alternatively, you can use hid instead if cython-hidapi fails to find your JoyCons.

`cython-hidapi` is what being installed when you do `pip install hidapi`. The library can be found [here](https://github.com/trezor/cython-hidapi). Mentioned above `hid` library can be found [here](https://github.com/apmorton/pyhidapi). Both of these Python libraries are just different take on wrapping `C` library called `hidapi` that can be [found here](https://github.com/libusb/hidapi). I tried cython-python one first with both build variants (with libusb and without - means with hidraw) and it just didn't work. The second choice (`pyhidapi`) did work, however.

Just following instructions was enough:
1. `sudo apt install libhidapi-hidraw0`
2. `pip install hid`

And here is a bit that took me a while to understand. [Next section in the instruction](https://github.com/trezor/cython-hidapi#udev-rules) about "Udev rules" is crucial! As I found [an answer](https://stackoverflow.com/a/62429857) to my own Stackoverflow question, udev rules from [this reddit post](https://www.reddit.com/r/Stadia/comments/egcvpq/using_nintendo_switch_pro_controller_on_linux/fc5s7qm/) will make everything work!

Just chuck this:
```
# Switch Joy-con (L) (Bluetooth only)
KERNEL=="hidraw*", SUBSYSTEM=="hidraw", KERNELS=="0005:057E:2006.*", MODE="0666"

# Switch Joy-con (R) (Bluetooth only)
KERNEL=="hidraw*", SUBSYSTEM=="hidraw", KERNELS=="0005:057E:2007.*", MODE="0666"

# Switch Pro controller (USB and Bluetooth)
KERNEL=="hidraw*", SUBSYSTEM=="hidraw", ATTRS{idVendor}=="057e", ATTRS{idProduct}=="2009", MODE="0666"
KERNEL=="hidraw*", SUBSYSTEM=="hidraw", KERNELS=="0005:057E:2009.*", MODE="0666"

# Switch Joy-con charging grip (USB only)
KERNEL=="hidraw*", SUBSYSTEM=="hidraw", ATTRS{idVendor}=="057e", ATTRS{idProduct}=="200e", MODE="0666"
```
into `/etc/udev/rules.d/50-nintendo-switch.rules` file and that's it.

Now, with everything in place (Joy-Con is connected, `pyhidapi` installed, `joycon-python` install) you can hopefully do:
```python
from pyjoycon import JoyCon, get_R_id

joycon_id = get_R_id() # in case u have Right Joy-Con connected ;-)
joycon = JoyCon(*joycon_id)

joycon.get_status()
```

Problem #4 - Remote coding/debugging with VSCode
------------------------------------------------

Even though I have VNC setup it is pretty slow and laggy. To feel like a human and be able to write code on Jetson Nano or Raspberry Pi I need something better.

The answer is [VS Code Remote Development](https://code.visualstudio.com/docs/remote/remote-overview). It is much more incredible then you can even imagine!

I am using SSH variant. You can read all the detailed instructions [over here](https://code.visualstudio.com/docs/remote/ssh). But since I am here, I will give a shortcut version.
1. Make sure you can `ssh` into your RPi or Jetson without a password. So if you can do `ssh <username>@<ip>` and get right into the console without a password prompt, you all good. If not, follow [this instruction](https://www.raspberrypi.org/documentation/remote-access/ssh/passwordless.md).
2. Install `Remote - SSH` plugin on your host machine.
3. Press <sub>></sub><sup><</sup> looking symbol on a green background at the left bottom of your VSCode.
4. Choose first `Remote-SSH: Connect to Host...`
5. Choose `+ Add New SSH Host...`
6. Put in `ssh <username>@<ip>`
7. Choose where to store this setting (I've chosen)
8. A new window will open, connect to your device and install all the necessary software on the remote machine.
9. All done. Now, you can even install VSCode plugins into the remote machine. Just open plugin page and notice `Install on SSH: <ip>` button! How cool is that?!
10. I've installed `Python` plugin and can even debug my scripts.
11. Opening files and folders is also integrated so that you choose them from the remote machine
12. This is specific for my python setup step. Because I am using python's `environments` I need to specify my Python Interpreter. For that, I open `Show All Commands` dropdown (`Cmd+Shit+P` on MacOS) and type `> Python: Select Interpreter`. There I can add a new one pointing to my environment (`~/env/bin/python` in my case, where `env` is the name of my environment).

That's it for today! Have fun!