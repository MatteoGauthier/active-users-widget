import { useQuery } from "@tanstack/react-query";
import { Card, Color, Flex, Grid, Icon, Metric, Text } from "@tremor/react";

import { formatStatNumber } from "../../../utils/common";
import { getStatistics } from "../../../utils/queries";
import CalendarIcon from "../../svgx/CalendarIcon";
import GlobeIcon from "../../svgx/GlobeIcon";
import LayerIcon from "../../svgx/LayerIcon";

type Props = {
  projectKey: string | null;
};

export default function StatsBanner({ projectKey }: Props) {
  const { data } = useQuery({
    queryKey: ["project", projectKey],
    queryFn: getStatistics,
    enabled: !!projectKey,
  });

  if (!data) return null;

  const categories: {
    title: string;
    metric: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    color: Color;
  }[] = [
    {
      title: "Last 30 minutes",
      metric: formatStatNumber(data.last30Minutes),
      icon: CalendarIcon,
      color: "indigo",
    },
    {
      title: "Total views",
      // @todo Replace with real data
      metric: data.totalViews ? formatStatNumber(data.totalViews) : "--",
      icon: LayerIcon,
      color: "fuchsia",
    },
    {
      title: "Most popular country",
      // @todo Replace with real data
      metric: "🇫🇷 France",
      icon: GlobeIcon,
      color: "amber",
    },
  ];
  return (
    <Grid numColsSm={2} numColsLg={3} className="gap-6">
      {categories.map((item) => (
        <Card key={item.title} decoration="top" decorationColor={item.color}>
          <Flex justifyContent="start" className="space-x-4">
            <Icon
              icon={item.icon}
              variant="light"
              size="xl"
              color={item.color}
            />
            <div className="truncate">
              <Text>{item.title}</Text>
              <Metric className="truncate">{item.metric}</Metric>
            </div>
          </Flex>
        </Card>
      ))}
    </Grid>
  );
}
