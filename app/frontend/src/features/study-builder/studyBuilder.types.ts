export interface NewQuestionState {
  text: string;
  type: 'single_choice' | 'multi_choice' | 'likert' | 'open_text';
  options: string[];
}
