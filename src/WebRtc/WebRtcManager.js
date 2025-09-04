export class WebRTCManager {
  constructor(ws, onLocalStream, onRemoteStream) {
    this.ws = ws;
    this.pc = null;
    this.localStream = null;
    this.remoteStream = null;
    this.onLocalStream = onLocalStream;
    this.onRemoteStream = onRemoteStream;
    this.candidateQueue = [];
  }

 async initConnection(isCaller, FriendId) {
  console.log("friend from init", FriendId);
  console.log("isCaller?", isCaller);

  this.pc = new RTCPeerConnection();

  this.pc.ontrack = (event) => {
    this.remoteStream = event.streams[0];
    if (this.onRemoteStream) this.onRemoteStream(this.remoteStream);
  };

  this.pc.onicecandidate = (event) => {
    if (event.candidate) {
      this.ws.send(JSON.stringify({
        type: "webrtc_ice_candidate",
        FriendId,
        data: event.candidate
      }));
    }
  };

  if (!this.localStream) {
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
if (this.onLocalStream) this.onLocalStream(this.localStream);  }

  this.localStream.getTracks().forEach(track => {
    this.pc.addTrack(track, this.localStream);
  });

  if (isCaller) {
    console.log("Creating and sending offer...");
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);

    this.ws.send(JSON.stringify({
      type: "webrtc_offer",
      FriendId,
      data: offer
    }));
  }
}


async handleOffer(offer, from) {
  await this.initConnection(false, from);

  await this.pc.setRemoteDescription(new RTCSessionDescription(offer));

  // ✅ Flush queued candidates AFTER remote description is set
  if (this.candidateQueue.length > 0) {
    console.log("Flushing queued ICE candidates:", this.candidateQueue.length);
    for (const c of this.candidateQueue) {
      try {
        await this.pc.addIceCandidate(c);
      } catch (err) {
        console.error("Error adding queued ICE:", err);
      }
    }
    this.candidateQueue = [];
  }

  const answer = await this.pc.createAnswer();
  await this.pc.setLocalDescription(answer);

  this.ws.send(JSON.stringify({
    type: "webrtc_answer",
    from,
    data: answer
  }));
}

async handleAnswer(answer) {
  await this.pc.setRemoteDescription(new RTCSessionDescription(answer));

  if (this.candidateQueue.length > 0) {
    console.log("Flushing queued ICE candidates:", this.candidateQueue.length);
    for (const c of this.candidateQueue) {
      try {
        await this.pc.addIceCandidate(c);
      } catch (err) {
        console.error("Error adding queued ICE:", err);
      }
    }
    this.candidateQueue = [];
  }
}


  async handleAnswer(answer) {
    await this.pc.setRemoteDescription(new RTCSessionDescription(answer));
  }

 async handleCandidate(candidate) {
  try {
    const ice = (typeof candidate === "string") 
      ? JSON.parse(candidate) 
      : candidate;

    if (this.pc) {
      await this.pc.addIceCandidate(new RTCIceCandidate(ice));
    } else {
      console.log("PC not ready, queueing candidate:", ice);
      this.candidateQueue.push(ice);
    }
  } catch (err) {
    console.error("ICE Candidate error:", err, candidate);
  }
}




  destroy() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }
    this.localStream = null;
    this.remoteStream = null;
  }

  closeConnection() {
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }
  }
}
