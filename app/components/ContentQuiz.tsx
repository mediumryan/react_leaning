import type {
  MultipleChoiceQuiz,
  ShortAnswerQuiz,
} from '~/data/contentData';
import { Button } from './ui/button';
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from './ui/field';
import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface ContentQuizProps {
  quiz: MultipleChoiceQuiz | ShortAnswerQuiz;
}

export default function ContentQuiz({ quiz }: ContentQuizProps) {
  return (
    <div>
      {quiz.type === 1 && (
        <FieldSet className="w-full">
          <FieldLegend variant="label">Quiz</FieldLegend>
          <FieldDescription>{quiz.question}</FieldDescription>
          <RadioGroup defaultValue={quiz.options[0]}>
            {quiz.options.map((option, index) => (
              <Field orientation="horizontal" key={index}>
                <RadioGroupItem value={option} id={`${quiz.id}-${index}`} />
                <FieldLabel
                  htmlFor={`${quiz.id}-${index}`}
                  className="font-normal"
                >
                  {option}
                </FieldLabel>
              </Field>
            ))}
          </RadioGroup>
        </FieldSet>
      )}

      {quiz.type === 2 && (
        <Field>
          <FieldLabel htmlFor={`quiz-input-${quiz.id}`}>
            {quiz.question}
          </FieldLabel>
          <Input
            id={`quiz-input-${quiz.id}`}
            className="max-w-sm"
            type="text"
            placeholder="解答を入力してください"
          />
        </Field>
      )}

      <Button className="mt-4 float-right">Submit</Button>
    </div>
  );
}
