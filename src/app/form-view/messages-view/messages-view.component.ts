import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {Message} from "../../algorithms/message/message";

const classifiersViewsComparator = (a, b) => (b.count - a.count) || (b.classifiersViews.length - a.classifiersViews.length);

@Component({
  selector: 'app-messages-view',
  templateUrl: './messages-view.component.html',
  styleUrls: ['./messages-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class MessagesViewComponent {
  @Input()
  set messages(value: Message[]) {
    if (!value || value.length === 0) {
      this.messagesViews = [];
      return;
    }
    const messagesSummariesMap: PrimitiveMap<MessageSummary> = {};
    value.forEach(m => insert(m, messagesSummariesMap));
    const summaries = Object.values(messagesSummariesMap);
    this.messagesViews = summaries.map(s => ({
      message: s.message,
      count: s.count,
      classifiersViews: formatClassifiersView(s.classifiers)
    }));
    this.messagesViews.sort(classifiersViewsComparator);
  }

  messagesViews: MessageView[];
  displayedColumns: (keyof MessageView)[] = ["message", "count", "classifiersViews"];
}

interface PrimitiveMap<T> {
  [key: string]: T;
}

function newMessageSummary(key: string): MessageSummary {
  return {classifiers: {}, count: 0, message: key};
}

function insert(message: Message, messages: PrimitiveMap<MessageSummary>) {
  const key = message.value.join("");
  const existing = computeIfAbsent(messages, key, newMessageSummary);
  ++existing.count;
  if (message.classifier) {
    const existingClsSum = computeIfAbsent(existing.classifiers, "" + message.classifier.id, newClassifiersSummary);
    ++existingClsSum.count;
  }
}

function computeIfAbsent<T>(map: PrimitiveMap<T>, key: string, sup: (key: string) => T) {
  let existing = map[key];
  if (!existing) {
    existing = sup(key);
    map[key] = existing;
  }
  return existing;
}

interface MessageSummary {
  message: string;
  count: number;
  classifiers: PrimitiveMap<ClassifiersSummary>;
}

interface MessageView {
  message: string;
  count: number;
  classifiersViews: string;
}

function formatClassifiersView(classifiers: PrimitiveMap<ClassifiersSummary>) {
  const view = Object.values(classifiers);
  view.sort((a, b) => (b.count - a.count) || (+b.classifier - +a.classifier));
  return view.map(c => `${c.classifier} (${c.count})`).join(", ");
}

interface ClassifiersSummary {
  classifier: string;
  count: number;
}

function newClassifiersSummary(key: string): ClassifiersSummary {
  return {classifier: key, count: 0};
}
