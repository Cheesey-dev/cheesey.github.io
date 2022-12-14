const lanyard = new WebSocket("wss://api.lanyard.rest/socket");


var statusIcon = document.getElementById("statusIcon");
var statusContent = document.getElementById("statusContent");


var api = {};
var received = false;

lanyard.onopen = function() {
    lanyard.send(
        JSON.stringify({
            op: 2,
            d: {
                subscribe_to_id: "833625345587413002",
            },
        })
    );
};

setInterval(() => {
    if (received) {
        lanyard.send(
            JSON.stringify({
                op: 3,
            })
        );
    }
}, 30000);

lanyard.onmessage = function(event) {
    received = true;
    api = JSON.parse(event.data);

    if (api.t === "INIT_STATE" || api.t === "PRESENCE_UPDATE") {
        update_presence();
    }
};

function update_presence() {
    if (statusIcon != null) {
        update_status(api.d.discord_status);
    }

    if (api.d.discord_status === "dnd") {
        statusContent.innerHTML = `<span class="w-3 h-3 bg-red-500 rounded-full inline-flex ml-1 mr-2"></span>Do not Disturb`;

    } else if (api.d.discord_status === "idle") {
        statusContent.innerHTML = `<span class="w-3 h-3 bg-yellow-500 rounded-full inline-flex ml-1 mr-2"></span>Idle`;

    } else if (api.d.discord_status === "online") {
        statusContent.innerHTML = `<span class="w-3 h-3 bg-green-500 rounded-full inline-flex ml-1 mr-2"></span>Online <br>
        <div class="presence">
        <p>
         Playing ${api.d.activities[1].name || "Nothing is Playing"}
        </p>
    </div> 
        `;

    } else if (api.d.discord_status === "offline") {
        statusContent.innerHTML = `<span class="w-3 h-3 bg-gray-500 rounded-full inline-flex ml-1 mr-2"></span>Offline `;

    } else {
        statusContent.innerHTML = `<div class="animate-pulse"><i class="fas fa-spinner-third"></i> Loading</div>`;

    }

}
