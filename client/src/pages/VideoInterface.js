import { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import CopyToClipboard from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";

const socket = io.connect(`${process.env.REACT_APP_BASE_URL}`);
function VideoInterface({ userName }) {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState(userName);
  const [muted, setMuted] = useState(false);
  const myVideo = useRef(null);
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
      });
    socket.on("me", (id) => {
      setMe(id);
      console.log("Received ID from socket:", socket.id);
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
      setName(data.name);
    });
    return () => {
      socket.off("me");
      socket.off("callUser");
    };
  }, []);

  useEffect(() => {
    if (stream && myVideo.current) {
      myVideo.current.srcObject = stream;
      myVideo.current.play();
    }
  }, [stream, myVideo]);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: userName,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };
  const handleMute = () => {
    if (stream && stream.getAudioTracks().length > 0) {
      stream.getAudioTracks()[0].enabled = !muted;
      setMuted(!muted);
    } else {
      console.warn("No audio track available.");
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="8">
          <h2 className="gradient-text">Video Call</h2>
          {stream && (
            <video
              className="w-100"
              ref={myVideo}
              muted={!muted}
              autoPlay
              playsInline
            />
          )}
          {callAccepted && !callEnded ? (
            <video
              className="w-100"
              ref={userVideo}
              autoPlay
              playsInline
              muted={!muted}
            />
          ) : null}
          <Container className="d-flex justify-content-between">
            <CopyToClipboard text={me}>
              <Button variant="primary" className="mx-2">
                <i className="bi bi-clipboard-fill"></i> Copy Your Calling ID
              </Button>
            </CopyToClipboard>
            <Form>
              <Form.Control
                type="text"
                placeholder="Enter caller's Id"
                aria-label="Caller's Id"
                value={idToCall}
                onChange={(e) => setIdToCall(e.target.value)}
              ></Form.Control>
            </Form>
            {callAccepted && !callEnded ? (
              <>
                <Button variant="secondary" onClick={handleMute}>
                  {!muted ? (
                    <>
                      <i className="bi bi-mic-mute-fill"></i> Unmute
                    </>
                  ) : (
                    <>
                      <i className="bi bi-mic-mute"></i> Mute
                    </>
                  )}
                </Button>
                <Button variant="danger" onClick={leaveCall}>
                  End Call
                </Button>
              </>
            ) : (
              <Button
                className="mx-2"
                variant="success"
                onClick={() => callUser(idToCall)}
              >
                <i className="bi bi-telephone-plus-fill"></i> Start Call
              </Button>
            )}
          </Container>

          <Container>{idToCall}</Container>
          {receivingCall && !callAccepted ? (
            <Container>
              <h1>{name} is calling...</h1>
              <Button variant="warning" onClick={answerCall}>
                Answer
              </Button>
            </Container>
          ) : null}
        </Col>
      </Row>
    </Container>
  );
}
export default VideoInterface;
