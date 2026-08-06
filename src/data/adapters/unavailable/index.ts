import type { ComplaintRepository, IntegrityCaseRepository, MatchRepository, PlayerRepository, TeamRepository, TournamentRepository } from "@/data/contracts";
import { unavailableState } from "@/lib/data-state";

const message = "No information is available for this view.";

export const unavailablePlayerRepository: PlayerRepository = { async list() { return unavailableState([], message); }, async findById() { return unavailableState(null, message); } };
export const unavailableTeamRepository: TeamRepository = { async list() { return unavailableState([], message); } };
export const unavailableTournamentRepository: TournamentRepository = { async list() { return unavailableState([], message); } };
export const unavailableMatchRepository: MatchRepository = { async findById() { return unavailableState(null, message); } };
export const unavailableComplaintRepository: ComplaintRepository = { async list() { return unavailableState([], message); } };
export const unavailableIntegrityCaseRepository: IntegrityCaseRepository = { async findById() { return unavailableState(null, message); } };
