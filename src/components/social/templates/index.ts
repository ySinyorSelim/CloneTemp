import type { TemplateDefinition } from "../types";
import { comparison } from "./comparison";
import { fixtures } from "./fixtures";
import { leagueTable } from "./league-table";
import { lineup, nationsLineup, tactic } from "./lineup";
import { matchResult } from "./match-result";
import { playerReview } from "./player-review";
import { award, playerRecommendation, staffRecommendation } from "./profile";
import { statTiles } from "./stat-tiles";
import { tip } from "./tip";
import { topList } from "./top-list";
import { transfer } from "./transfer";

/**
 * Template registry. To add a new post type, create a file in this folder
 * with `defineTemplate(...)` and add it to this list — the studio picks up
 * the form, preview and export automatically. Several templates can share
 * one card component with different sample data (see lineup.tsx, profile.tsx).
 */
export const TEMPLATES: TemplateDefinition[] = [
  playerReview,
  playerRecommendation,
  comparison,
  transfer,
  award,
  lineup,
  nationsLineup,
  tactic,
  staffRecommendation,
  matchResult,
  leagueTable,
  fixtures,
  statTiles,
  topList,
  tip,
];
