import type { Car, User } from "@/generated/prisma/client";
import { formatDistanceToNow } from "date-fns";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { getAuth } from "@/features/auth/queries/get-auth";
import { PlaceHolder } from "./placeholder";

type CommentWithUser = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  ticketId: string;
  user: Pick<User, 'id' | 'username' | 'email'>;
};

type CommentProps = {
  ticket: Car;
  comments: CommentWithUser[];
};


const Comments = async ({ ticket, comments }: CommentProps) => {
  const currentUser = await getAuth();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {comments.map((comment) => {
          const isEdited = comment.createdAt.getTime() !== comment.updatedAt.getTime();
          const timeAgo = formatDistanceToNow(new Date(comment.updatedAt), { addSuffix: true });
          
          return (
            <Card key={comment.id} className="overflow-hidden
              transition-all hover:shadow-md">
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{comment.user.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{comment.user.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {timeAgo}
                      {isEdited && ' • Edited'}
                    </p>
                  </div>
                </div>
                { comment.user.id === currentUser?.user?.id && (
                 <PlaceHolder label="Add a comment" />
                )}
              </CardHeader>
              <CardContent className="px-4 py-2">
                <p className="whitespace-pre-line">{comment.content}</p>
              </CardContent>
              <CardFooter className="px-4 py-2 bg-muted/50 text-xs text-muted-foreground">
                {isEdited ? (
                  <span>Updated {formatDistanceToNow(new Date(comment.updatedAt), { addSuffix: true })}</span>
                ) : (
                  <span>Posted {timeAgo}</span>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Add a comment</h3>
        <Card>
          <CardContent className="p-4">
            <PlaceHolder label="Add a comment" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { Comments };
export type { CommentWithUser };
