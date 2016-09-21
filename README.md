# Advanced Editor like Medium

## Preface
This project depend on this repo [yabwe/medium-editor](https://github.com/yabwe/medium-editor), i extended his work to add cool feature as pictures, videos, embed stuff.
I kept things simple and easy as original Medium editor style.
The code in this project only handle front-end part you need some work on backend side to complete inserting pictures and videos.

![](http://abenbachir.github.io/MediumEditor/assets/images/photo1.png)


## Image upload:
I currently use readFile function (see line 241) to render images locally :
```javascript
readFile(file, function(url){
	insertImage(getCurrentFocusedElement(),url);
});
```
Change it with :
```javascript
var articleId = 12345; // suppose this is the id of your article
uploadFile('/drafts/'+ articleId +'/pictures', {'qqfile':file}, function(data){
        insertImage(getCurrentFocusedElement(),data.html);
    }, function(event, responseText){
        console.log(responseText);
});
```
In the backend you must handle the image upload and return the image link, exemple : upload to AWS S3 server and get the resource link.

## Embed Videos :
If you have PHP as your backend service, use [Essence](https://github.com/essence/essence) : Essence is an information extractor for any media link youtube, vimeo, twitter …

How it works :

1. Send the link from frontend to backend 
2. Use Essence to extract metadata : 
3. Parse essence metadata and build HTML/json/xml 
4. Return the informations (background-image, caption, width, height, or HTML )

If you use this bundle [EmbedBundle](https://github.com/abenbachir/EmbedBundle) you will have the steps 2,3,4 done.

# Contribution
Your contribution are welcome :).
