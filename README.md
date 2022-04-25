# easy-yagna-js
Running things on Golem is really hard, which is a thing that is agreed upon by most members. This is a solution for uploading dependencies without the <personal> use of Docker. Abstracting & making things high-level is essential for adoption, so hopefully this can be useful for someone. We will upload our node_modules directory to the provider directly, and have the provider extract the contents so that it can use the modules. This is also faster than re-building everytime you need a new module, so even if you understand how it works you may have some interest in implementing this into your workflow. 

## **Walk-through**
First, make sure that you have a `node_modules` directory in your local directory. Otherwise do this on Windows: Right click > New > Folder
Then install your dependencies. In this example, we will run `npm install node-emoji`. Make sure that it gets installed in the `node_modules` directory.
We need to install archiver for ourselves to zip the file with our `zip.js` script. Run `npm install archiver`
Run `node zip.js` to zip your `node_modules` directory.
The provider will run `npm install extract-zip -g` to install a tool to extract the contents. This is not possible to run on default on Windows, but you don't have to - only the provider has to. It will also extract with this command, but again, you don't have to run this: `extract-zip node_modules.zip`
Start your yagna daemon: `yagna service run`
Enable the daemon as a requestor: `yagna payment init --sender`
Set your YAGNA_APPKEY: `set YAGNA_APPKEY=your-32-char-app-key` (found with `yagna app-key list`)
Install yajsapi: `npm install yajsapi`
Run `node requestor.js`

**Building (optional)**
```
$ docker build -t easyyagnajs:latest .
$ gvmkit-build easyyagnajs:latest
$ gvmkit-build easyyagnajs:latest --push
```
Copy the hash & swap it out on this line.