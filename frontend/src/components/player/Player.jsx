import { Button, Col, Layout, Row, Space } from "antd";
import SongPreview from "./songpreview/SongPreview.jsx";
import Timer from "./timer/Timer.jsx";
import {
  CaretRightOutlined,
  PauseOutlined,
  PlayCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
} from "@ant-design/icons";
import { forwardRef, useEffect, useRef, useState } from "react";
import { publish, subscribe } from "../../utils/events.jsx";
import { get } from "../../utils/CustomRequests.jsx";
import { API } from "../../utils/API.jsx";
import Volume from "./Volume.jsx";

const Player = forwardRef(({}, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const [playingPlaylistId, setPlayingPlaylistId] = useState(null);
  const [playingLikes, setPlayingLikes] = useState(null);
  const [playingData, setPlayingData] = useState(null);
  const [playingAlbumId, setPlayingAlbumId] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);

  const [song, setSong] = useState({
    title: null,
    artists: [],
    image: null,
  });

  useEffect(() => {
    subscribe("play", (e) => {
      console.log("play", e.detail);
      const data = e.detail;
      setIsPlaying(true);
      if (playingId === data.id) {
        console.log("play from pause", data.id, playingId);
        audioRef.current?.play();
      }
      setPlayingId(data.id);
      setPlayingAlbumId(data.albumId);
      setPlayingPlaylistId(data.playlistId);
      setPlayingLikes(data.likes);
    });

    subscribe("pause", (e) => {
      audioRef.current?.pause();
      setIsPlaying(false);
    });
  }, []);

  useEffect(() => {
    get(API.getMusiqueById + "/" + playingId, {
      success: (data) => {
        setPlayingData(data.data);
        setSong({
          title: data.title,
          artists: data.artists,
          image: data.image,
          duration: data.duration,
        });
      },
    });
  }, [playingId]);

  useEffect(() => {
    if (!playingData) return;
    audioRef.current?.play();
  }, [playingData]);
  const audioRef = useRef(null);

  const onTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  return (
    <Layout>
      <audio
        ref={audioRef}
        src={playingData}
        onTimeUpdate={onTimeUpdate}
      ></audio>
      <Row align={"middle"}>
        <Col span={8}>
          <SongPreview
            song={{
              title: song.title,
              artists: song.artists,
              image: song.image,
              duration: song.duration,
            }}
          ></SongPreview>
        </Col>
        <Col span={12}>
          <Space
            size={20}
            style={{
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Button
              type={"primary"}
              ghost
              shape={"circle"}
              icon={<StepBackwardOutlined />}
            ></Button>
            <Button
              type={"primary"}
              ghost
              size={"large"}
              shape={"circle"}
              onClick={() => {
                console.log("play", isPlaying);
                if (isPlaying) {
                  publish("pause", {
                    id: playingId,
                    albumId: playingAlbumId,
                    playlistId: playingPlaylistId,
                    likes: playingLikes,
                  });
                } else {
                  publish("play", {
                    id: playingId,
                    albumId: playingAlbumId,
                    playlistId: playingPlaylistId,
                    likes: playingLikes,
                  });
                }
              }}
              icon={isPlaying ? <PauseOutlined /> : <CaretRightOutlined />}
            ></Button>
            <Button
              type={"primary"}
              ghost
              shape={"circle"}
              icon={<StepForwardOutlined />}
            ></Button>
          </Space>
          <Timer
            onAfterChange={(time) => {
              audioRef.current.currentTime = time;
            }}
            currentTime={currentTime}
            endTime={song.duration}
          ></Timer>
        </Col>
        <Col span={4}>
          <Volume
            onChange={(value) => {
              audioRef.current.volume = value / 100;
              setVolume(value);
            }}
            volume={volume}
          />
        </Col>
      </Row>
    </Layout>
  );
});

export default Player;
