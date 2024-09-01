export type TasksList = {
  count: number;
  list: Array<TaskItem>;
};

export type TaskItem = {
  id: string;
  title: string;
};
