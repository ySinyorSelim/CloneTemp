import type { TemplateDefinition } from "../types";
import { leagueTable } from "./league-table";
import { lineup } from "./lineup";
import { matchResult } from "./match-result";
import { playerReview } from "./player-review";
import { topList } from "./top-list";

/**
 * Template registry. To add a new post type, create a file in this folder
 * with `defineTemplate(...)` and add it to this list — the studio picks up
 * the form, preview and export automatically.
 */
export const TEMPLATES: TemplateDefinition[] = [playerReview, lineup, leagueTable, matchResult, topList];
