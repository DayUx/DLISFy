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
import { publish, subscribe, unsubscribe } from "../../utils/events.jsx";
import { get } from "../../utils/CustomRequests.jsx";
import { API } from "../../utils/API.jsx";
import Volume from "./Volume.jsx";

const Player = forwardRef(({}, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(localStorage.getItem("volume") || 50);
  const [songPlaying, setSongPlaying] = useState(
    (localStorage.getItem("songPlaying")
      ? JSON.parse(localStorage.getItem("songPlaying"))
      : null) || {
      id: null,
      albumId: null,
      playlistId: null,
      artistId: null,
      styleId: null,
      likes: null,
      titles: [],
    }
  );

  useEffect(() => {
    localStorage.setItem("volume", volume);
  }, [volume]);

  const [song, setSong] = useState();

  useEffect(() => {
    get(API.getMusiqueById + "/" + songPlaying.id, {
      success: (data) => {
        setSong({
          ...data,
        });
      },
    });
    audioRef.current?.play();
  }, [songPlaying.id]);

  const play = (e) => {
    console.log("play", e.detail, songPlaying);
    const data = e.detail;
    setIsPlaying(true);
    if (songPlaying.id === data.id) {
      console.log("play from pause", data.id, songPlaying.id);
      audioRef.current?.play();
    }
    setSongPlaying({
      ...data,
    });
  };

  useEffect(() => {
    subscribe("play", play);
    localStorage.setItem("songPlaying", JSON.stringify(songPlaying));
    return () => {
      unsubscribe("play", play);
    };
  }, [songPlaying]);

  useEffect(() => {
    subscribe("pause", (e) => {
      audioRef.current?.pause();
      setIsPlaying(false);
    });
    audioRef.current.volume = volume / 100;
  }, []);

  const audioRef = useRef(null);

  const onTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };
  const previous = () => {
    if (previousDisabled()) return;
    const index = songPlaying.titles.findIndex(
      (t) => t.titleId === songPlaying.id
    );
    console.log("prev", index);
    publish("play", {
      ...songPlaying,
      id: songPlaying.titles[index - 1].titleId,
    });
  };

  const next = () => {
    if (nextDisabled()) return;
    const index = songPlaying.titles.findIndex(
      (t) => t.titleId === songPlaying.id
    );
    console.log("next", index);
    console.log("next", songPlaying);
    publish("play", {
      ...songPlaying,
      id: songPlaying.titles[index + 1].titleId,
    });
  };

  const nextDisabled = () => {
    return (
      songPlaying.titles.findIndex((t) => t.titleId === songPlaying.id) ===
        songPlaying.titles.length - 1 || songPlaying.titles.length === 0
    );
  };
  const previousDisabled = () => {
    return (
      songPlaying.titles.findIndex((t) => t.titleId === songPlaying.id) === 0 ||
      songPlaying.titles.length === 0
    );
  };

  return (
    <Layout>
      <audio
        ref={audioRef}
        onEnded={() => {
          next();
        }}
        src={
          API.streamMusique +
          "/" +
          songPlaying.titles.find((t) => t.titleId === songPlaying.id)?.fileId
        }
        onTimeUpdate={onTimeUpdate}
      ></audio>
      <Row align={"middle"}>
        <Col span={8}>
          <SongPreview song={song}></SongPreview>
        </Col>
        <Col span={8}>
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
              disabled={previousDisabled()}
              onClick={previous}
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
                  publish("pause");
                } else {
                  publish("play", songPlaying);
                }
              }}
              icon={isPlaying ? <PauseOutlined /> : <CaretRightOutlined />}
            ></Button>
            <Button
              type={"primary"}
              ghost
              disabled={nextDisabled()}
              onClick={next}
              shape={"circle"}
              icon={<StepForwardOutlined />}
            ></Button>
          </Space>
          <Timer
            onAfterChange={(time) => {
              console.log("onAfterChange", time);
              audioRef.current.currentTime = time;
            }}
            currentTime={currentTime}
            endTime={song?.duration}
          ></Timer>
        </Col>
        <Col offset={2} span={4}>
          <Volume
            onChange={(value) => {
              console.log("volume", value / 100);
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
