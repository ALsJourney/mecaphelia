import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface CardCompactProps {
  title: string;
  description: string;
  content: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

const CardCompact = ({
  title,
  description,
  content,
  className,
  footer,
}: CardCompactProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardContent>{content}</CardContent>
      </CardHeader>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};

export { CardCompact };
