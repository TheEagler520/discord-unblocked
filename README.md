# Discord *Unblocked*

Entirely unblocked Discord access for managed or enrolled devices, like school Chromebooks. Using a headless ScramJet proxy server.

### Use It

Create a GitHub Codespace, or download the code locally and run the following command in the terminal:
```bash
$ bash scripts/init.sh
```

### Vercel (experimental)

Import this repository into Vercel from the repository root. `vercel.json` configures a Node.js function and runs the ScramJet/WASM and frontend builds during deployment; the first deployment may take a while.

Vercel Hobby functions have a maximum duration of 300 seconds. Since proxy traffic uses WebSockets, active sessions may be disconnected when that limit is reached. Use a persistent WebSocket-capable host if that is unreliable.

>[!NOTE]
>I have deployed it to Vercel! Huge thanks to Transicle for the original project, however it was broken as this was built for an older version of Scramjet. I have fixed it so now you can upload this to any static website host for free, and it WILL work! whether you want to open a port in codespaces or upload it to a static website host, either will work. I have also made my own link, feel free to use it.
>(after 937 modified files, send help)


<img width="1365" height="767" alt="image" src="https://github.com/user-attachments/assets/ec0ea144-acc3-4df2-a491-7e1a364f0cf5" />
