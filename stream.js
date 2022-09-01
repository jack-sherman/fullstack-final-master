// Client ID: w3jiov5fysm8ndq4hd9i1ea02byb67
// Secret: In gitignored file for now
const client = 'w3jiov5fysm8ndq4hd9i1ea02byb67';

const url = 'https://api.twitch.tv/helix/';


getStreams().then(data => displayStreams(data));

async function getStreams() {
    //Normally would put the key in an environment variable, but didn't have time to get it working
    let getToken = await fetch('https://id.twitch.tv/oauth2/token?client_id=w3jiov5fysm8ndq4hd9i1ea02byb67&client_secret=vttlq2vjqfhe3md0onwis9hg1s7nhp&grant_type=client_credentials', 
    {
        method: 'POST',
    });
    let token = await getToken.json();
    token = token.access_token;
 
    let response = await fetch(url + 'streams?game_id=743&first=6', {
        headers: {
            'Client-ID': client,
            'Authorization': 'Bearer ' + token,
        }   
    });
    let data = await response.json();

    return data;
}
    
function displayStreams(data){
    for(var i = 0; i < 6; i++){

        var card = ("card" + (i+1).toString());

        var cardContents = document.getElementById(card);

        Vdata = data.data;


        Vtitle = Vdata[i].title;
        if(Vtitle.length > 23){
            Vtitle = Vtitle.substring(0,19) + "...";
        }

        Vname = Vdata[i].user_name;
        Vviewer = Vdata[i].viewer_count;
        Vlink = "http://www.twitch.tv/" + Vname;
        Vlink = ("<a href=\"" + Vlink + "\">");

        Vthumb = Vdata[i].thumbnail_url;
        Vthumb = Vthumb.toString().replace("{height}", "126");
        Vthumb = Vthumb.toString().replace("{width}", "225");

        Vimage = ("<img src=\"" + Vthumb + "\" alt=\"placeholder alt text\"></img></div>");

        cardContents.innerHTML += "<br>" + Vimage + "<br>";
        cardContents.innerHTML += Vlink + Vtitle + "</a><br>";
        cardContents.innerHTML += Vname + " - " + Vviewer + " Viewers";

    }
}
