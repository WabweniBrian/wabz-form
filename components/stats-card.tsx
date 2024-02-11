import React, { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "./ui/skeleton";

const StatsCard = ({
  title,
  icon,
  helperText,
  value,
  loading,
  className,
}: {
  title: string;
  icon: ReactNode;
  helperText: string;
  value: string;
  loading: boolean;
  className: string;
}) => {
  return (
    <Card className={className}>
      <CardHeader className="flex-center-between flex-row pb-2">
        <CardTitle className="font-semibold text-sm">{title}</CardTitle>
        <div>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {loading && (
            <Skeleton>
              <span className="opacity-0">0</span>
            </Skeleton>
          )}
          {!loading && value}
        </div>
        <p className="text-sm text-muted-foreground">{helperText}</p>
      </CardContent>
    </Card>
  );
};
export default StatsCard;
