import { google } from 'googleapis';
import { getOAuth2ClientForUser } from 'services/google';
import { NextFunction, Request, Response } from 'express';
import { TASKS_CONFIG } from 'config';
import { TaskItem, TasksList } from 'models/api/tasks';
import { ApiError } from 'models/api/api_error';
import { LOGGER } from 'services/loggers';

export const getTaskLists = async (req: Request, res: Response, next: NextFunction) => {
  const auth = await getOAuth2ClientForUser(req.headers);
  const tasks = google.tasks({
    version: 'v1',
    auth,
  });
  const maxResults = await parseCountQueryParameter(req);
  tasks.tasklists
    .list({
      maxResults,
    })
    .then((response) => response.data)
    .then((data) => {
      const list = data.items ?? [];
      const taskLists: TaskItem[] = [];
      list.forEach((taskList) => {
        if (taskList?.title && taskList?.id) {
          taskLists.push({
            id: taskList.id,
            title: taskList.title,
          });
        }
      });
      return {
        count: taskLists.length,
        list: taskLists,
      } as TasksList;
    })
    .then((taskList) => res.status(200).json(taskList))
    .catch((err) => {
      LOGGER.error(err);
      next(new ApiError('Error while retrieving task lists', err, 500));
    });
};

const parseCountQueryParameter = async (req: Request): Promise<number> => {
  return parseInt((req.query.count as string) ?? TASKS_CONFIG.DEFAULT_TASKS_COUNT);
};
