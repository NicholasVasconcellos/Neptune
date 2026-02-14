import { StyleProp, ViewStyle } from "react-native";
import { Card as PaperCard } from "react-native-paper";
import React, { ReactNode } from "react";

interface CardProps {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  mode?: "elevated" | "outlined" | "contained";
}

const Card = ({ style, children, mode = "elevated", ...args }: CardProps) => {
  return (
    <PaperCard mode={mode} style={[{ marginVertical: 6 }, style]} {...args}>
      <PaperCard.Content>{children}</PaperCard.Content>
    </PaperCard>
  );
};

export default Card;
