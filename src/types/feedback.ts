export interface IFeedback {
  id: number;
  lessonId: number;
  processedDataId: number;
  userId: number;
  comment: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IFeedbackDto {
  lessonId: number;
  processedDataId: number;
  comment: string;
}

export interface IFeedbackDtoUpdate {
  id: number;
  comment?: string;
  status?: boolean;
}

export interface IFeedbackChangeStatus {
  id: number,
  status: boolean
}
