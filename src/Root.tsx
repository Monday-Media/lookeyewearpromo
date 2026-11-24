import React from "react";
import { Composition } from "remotion";
import { Film } from "./film/Film";
import { FilmV, VW, VH } from "./film/FilmV";
import { FPS, W, H, LENGTH } from "./kit/kit";

export const Root: React.FC = () => (
  <>
    <Composition id="Film" component={Film} durationInFrames={Math.round(LENGTH * FPS)} fps={FPS} width={W} height={H} defaultProps={{ sound: true }} />
    <Composition id="FilmV" component={FilmV} durationInFrames={Math.round(LENGTH * FPS)} fps={FPS} width={VW} height={VH} defaultProps={{ sound: true }} />
  </>
);
