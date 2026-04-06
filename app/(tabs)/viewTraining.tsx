import { View } from "react-native";
import React from "react";
import { Text } from "@/components/ui";

const viewTraining = () => {
  return (
    <View className="p-4 gap-2">
      <Text variant="headline" className="text-center mt-10">
        Start a Training Now
      </Text>
      <Text variant="body" className="text-base">
        Select a training to begin
      </Text>
    </View>
  );
};

export default viewTraining;
