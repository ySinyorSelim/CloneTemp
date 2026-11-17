import type { TemplateDefinition } from "../types";
import { announcement } from "./announcement";
import { comparison } from "./comparison";
import { fixtures } from "./fixtures";
import { fmProfile } from "./fm-profile";
import { leagueTable } from "./league-table";
import { lineup, nationsLineup, tactic } from "./lineup";
import { matchResult } from "./match-result";
import { playerReview } from "./player-review";
import { poll } from "./poll";
import { award, playerRecommendation, scoutReport, staffRecommendation } from "./profile";
import { finances, statTiles } from "./stat-tiles";
import { timeline } from "./timeline";
import { tip } from "./tip";
import { topList, topScorers, youthIntake } from "./top-list";
import { transfer } from "./transfer";

/**
 * Template registry. To add a new post type, create a file in this folder
 * with `defineTemplate(...)` and add it to this list — the studio picks up
 * the form, preview and export automatically. Several templates can share
 * one card component with different sample data (see lineup.tsx, profile.tsx).
 */
export const TEMPLATES: TemplateDefinition[] = [
  playerReview,
  fmProfile,
  playerRecommendation,
  scoutReport,
  comparison,
  transfer,
  award,
  lineup,
  nationsLineup,
  tactic,
  staffRecommendation,
  youthIntake,
  matchResult,
  leagueTable,
  fixtures,
  topScorers,
  statTiles,
  finances,
  timeline,
  topList,
  tip,
  poll,
  announcement,
];
