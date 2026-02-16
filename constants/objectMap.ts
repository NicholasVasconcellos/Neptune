import { ComponentType } from "react";
import AthleteForm from "../components/InputForms/AthleteForm";
import TeamForm from "../components/InputForms/TeamForm";
import TimeForm from "../components/InputForms/TimeForm";

export interface TableMetadata {
  tableName: string;
  label: string;
  icon: string;
  iconSet: "fa5" | "fa6";
  formComponent: ComponentType;
}

export const OBJECT_MAP: Record<string, TableMetadata> = {
  Athletes: {
    tableName: "Athletes",
    label: "Athletes",
    icon: "swimmer",
    iconSet: "fa5",
    formComponent: AthleteForm,
  },
  Teams: {
    tableName: "Teams",
    label: "Teams",
    icon: "people-group",
    iconSet: "fa6",
    formComponent: TeamForm,
  },
  Times: {
    tableName: "Times",
    label: "Times",
    icon: "stopwatch",
    iconSet: "fa6",
    formComponent: TimeForm,
  },
};
