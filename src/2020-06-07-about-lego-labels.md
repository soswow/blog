---
title: About preparing labels for lego collection
date: 2020-06-07
layout: post.njk
collection: posts
tags: blog lego
---

Background
----------
Over time we've collected a reasonable collection of lego parts. An initial big boost was given by my oldest brother who gave us his grown up son's collection. When we moved to Australia we left it behind, prepared in a suitcase. A bit later an acquaintance agreed to take it with him on his way to Australia. Pro Tip: if you ask a  person in it's 20s  to carry 23kg of lego in a second separate suitcase think what to say on the border because 100% this will look suspicious. If only someone gave us this tip. 🤦🏻‍♂️ Poor guy was not ready for some extra time on the border 🤣

When we settled in Australia we bought [TROFAST](https://www.ikea.com/au/en/cat/toy-storage-20474/) storage solution for toys. Because we had like 9-12 drawers we decided to separate all lego parts by color. Later I found out that this is classic next step for lego owners who reach a particular size.

Also around that time (~5 years ago) one very generous gentlemen at [Robots And Dinosaurs Sydney hacker space](https://robodino.org/) gifted me 8 or 10 of these:
[![Craft Cabinet]({{ site["baseurl"] }}/images/small/2020-06-07-about-lego-labels_1.jpg)]({{ site["baseurl"] }}/images/2020-06-07-about-lego-labels_1.jpg)

The problem was all of them were filled with electronics components, that owner didn't need anyway. For 5 years they were not used, taking space moving from place to place with me because I didn't have time nor motivation to clean them up and use this storage for something else.

Until now. Over a couple of weeks I painstakingly moved all the electronics into bags (detaching and labels was the hardest part).
[![De-labeled Craft Cabinet]({{ site["baseurl"] }}/images/small/2020-06-07-about-lego-labels_2.jpg)]({{ site["baseurl"] }}/images/2020-06-07-about-lego-labels_2.jpg)
The plan is to use one or two boxes for my own electronics components and other small things in the shop, and the rest of them use for storing lego.

LEGO labels source
------------------
Now, when you have some background we come to the topic of this post: lego labels. I started with quick googling  that gave me this wonderful resource: https://brickarchitect.com/ It's pretty much what I was looking for. It has tons of very concise information on the topic of lego organisation. Author, [Tom Alphin](https://www.instagram.com/tomalphin/?hl=en), even made free labels! And that's what we going to talk about here.

On his website Tom encourages lego enthusiasts to buy one of Brother's label makers (like [this one](https://www.amazon.com/dp/B00OCEKCB2/ref=as_li_ss_tl?ie=UTF8&linkCode=ll1&tag=thebrickarchitect-20&linkId=debb0ec67aff5b7d7d35224d45e34458)). Because labels he shares with the worlds are in special file format these Label Makers consume. Unfortunately for me, I already bought a label maker ([cheaper and dumber one](https://www.amazon.com.au/gp/product/B076LQ535N/ref=as_li_ss_tl?ie=UTF8&psc=1&linkCode=ll1&tag=soswow-22&linkId=329e5111e440b8b7fef5b058dfde2db6&language=en_AU)) and I didn't want to spend more money on another one.

Instead, I decided to buy some [Self Adhesive A4 paper](https://www.amazon.com.au/gp/product/B07KW4XFPT/ref=as_li_ss_tl?ie=UTF8&psc=1&linkCode=ll1&tag=soswow-22&linkId=31b6bb2ef8e76c3a380763d488ce8324&language=en_AU), print those labels on my Inkjet printer and cut them out manually. Unfortunately, I didn't find an easy straight forward way of getting what I wanted.

What Tom [provides](https://brickarchitect.com/labels/#download_lego_brick_labels) are two things: 
* `LEGO_BRICK_LABELS.zip` - which holds a bunch of `.lbx` files that you can use with Brother label makers
* `LEGO_BRICK_LABELS-CONTACT_SHEET.pdf` - which is a PDF that was crafted manually by Tom with all the labels:

[![PDF Page sample]({{ site["baseurl"] }}/images/small/2020-06-07-about-lego-labels_4.jpg)]({{ site["baseurl"] }}/images/2020-06-07-about-lego-labels_4.png)

Even though `.pdf` file seems to be what I need, there are problems with that. It wasn't made with a purpose in mind of being printed on self-adhesive paper. Amount of white space all around actual labels will consume an unnecessarily large amount of waste paper material. The other minor problem is the label format. Here is a sample label layout:
[![Default Label Format]({{ site["baseurl"] }}/images/small/2020-06-07-about-lego-labels_3.jpg)]({{ site["baseurl"] }}/images/2020-06-07-about-lego-labels_3.png)
Its design assumes one box/tray contains just one type of part with just one label. My case, on the other hand, is a little bit different. Since I am no [Brick Man](https://en.wikipedia.org/wiki/Ryan_McNaught) and don't have as many parts in my collection, I expect to save up and have more than one type of part in a single tray. There won't be enough place on the front to place many such labels. So, if I could strip off code number and description keeping only the image, that would be good enough.

Extracting Lego Part images
---------------------------

From Tom's website:
> The images were created using custom LDraw scripts that optimize the viewing angle and enhance the contrast of each part. The scripts are proprietary and hard to use, and the labels are free for non-commercial use.

At this point, I am familiar with [LDraw](https://www.ldraw.org/), but since Tom is not sharing any specifics about rendering settings I won't be able to re-render them myself.

Another approach could be editing PDF in a vector graphics editor, like Inkscape. Which I tried and quickly decided not to continue. It was pretty tedious and I wanted to explore other options.

[![Default Label Format]({{ site["baseurl"] }}/images/small/2020-06-07-about-lego-labels_5.jpg)]({{ site["baseurl"] }}/images/2020-06-07-about-lego-labels_5.png)

I decided to look into `.lbx` files. This is a format that can be opened with "Brother P-touch Editor". Which looks like very specialized minimal vector graphics editor for preparing labels. It looks like this:

[![Brother P-touch Editor]({{ site["baseurl"] }}/images/small/2020-06-07-about-lego-labels_6.jpg)]({{ site["baseurl"] }}/images/2020-06-07-about-lego-labels_6.png)

I was hoping to find some kind of "Export as ..." menu item, but no luck.

Googling more I've discovered that `.lbx` is just a `zip` file. After unzipping I found a bunch of `.bmp` files and couple of `.xml` files. Raster images were what Tom rendered with LDraw. That's exactly what I need!

In total there are about 200 `.lbx` files. First I moved them into one place (they were distributed in subfolders). Then, I renamed them to `.zip` with
```bash
for file in *.lbx
    do
        echo mv "$file" "${file/zip./}"
    done
```
`unzip *.zip` unziped all the files into the respective folders. The reason individual folders were needed is that each of the archives had images with the same names like `Object0.bmp`, `Object1.bmp`. Next step was to move all image files into one place. And since all files have same name I had to be creative. The language I know the best is `JS` so I've written a script that would move images while adding prefix of its folder:
```typescript
import * as fs from "fs";
import * as path from "path";

function walkDir(dir: string, callback: (string) => void) {
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir("./source", (localPath: string) => {
  if (localPath.endsWith(".bmp")) {
    const prefix = path.basename(path.dirname(localPath));
    const fileName = path.basename(localPath);
    fs.copyFileSync(localPath, `images/${prefix}-${fileName}`);
  }
});
```

Now, images are extracted
[![Images are ready]({{ site["baseurl"] }}/images/small/2020-06-07-about-lego-labels_7.jpg)]({{ site["baseurl"] }}/images/2020-06-07-about-lego-labels_7.png)

Next step is pure magic. Some time ago, while working on a different project I've discovered a tool called [montage](http://www.imagemagick.org/Usage/montage/) which is part of ImageMagick package. It allows you to compile a bunch of images into one big image. After a bit of tinkering I've come up with this command line:
```bash
montage *.bmp -tile 20x14 -geometry 120x120+10+10 ../all-together-page-%d.jpg
```
Here is a breakdown:
* `*.bmp` - take all `bmp` images in current folder
* `-tile 20x14` - I want to have 20 tiles horizontally and 14 vertically in one file
* `-geometry 120x120+10+10` - each image needs to be resized (up or down) to 120px by 120px with 10px padding from all sides
* `../all-together-page-%d.jpg` - resulting images name using `%d` is where page number will go

Here is a sample of resulting image:
[![Resulting image sample]({{ site["baseurl"] }}/images/small/2020-06-07-about-lego-labels_8.jpg)]({{ site["baseurl"] }}/images/2020-06-07-about-lego-labels_8.jpg)

Here are resulting images free for download: [1]({{ site["baseurl"] }}/images/all-together-page-0.jpg), [2]({{ site["baseurl"] }}/images/all-together-page-1.jpg), [3]({{ site["baseurl"] }}/images/all-together-page-2.jpg), [4]({{ site["baseurl"] }}/images/all-together-page-3.jpg), [5]({{ site["baseurl"] }}/images/all-together-page-4.jpg). Since these images extracted from Tom's label files I have to say you can only use these images for noncommercial use because this is what Tom says about label files.

After printing them out and many days of manual sorting this is what I have so far:
[![Unused labels]({{ site["baseurl"] }}/images/small/2020-06-07-about-lego-labels_9.jpg)]({{ site["baseurl"] }}/images/2020-06-07-about-lego-labels_9.jpg)
[![Two boxes sorted]({{ site["baseurl"] }}/images/small/2020-06-07-about-lego-labels_10.jpg)]({{ site["baseurl"] }}/images/2020-06-07-about-lego-labels_10.jpg)

I hope it was useful. Have a good one!
