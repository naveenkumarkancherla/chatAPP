import { CommonModule, } from '@angular/common';
import { Component, inject , ElementRef, AfterViewInit, ViewChild} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { GeminiService } from './gemini.service';
import { SkeletonComponent } from './skeleton/skeleton.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SkeletonComponent, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
@ViewChild('messageInput') messageInput!: ElementRef;

  title = 'gemini-inte';

  ngAfterViewInit() {
    this.focusInput();
  }
  prompt: string = '';

  geminiService: GeminiService = inject(GeminiService);

  loading: boolean = false;

  chatHistory: any[] = [];
  constructor() {
    this.geminiService.getMessageHistory().subscribe((res) => {
      if(res) {
        this.chatHistory.push(res);
      }
    })
  }

  async sendData() {
    if(this.prompt && !this.loading) {
      this.scrollToBottom();
      this.loading = true;
      const data = this.prompt;
      this.prompt = '';
      await this.geminiService.generateText(data);
      this.prompt = '';
      this.scrollToBottom();
      this.loading = false;
      setTimeout(() => {this.focusInput()}, 0);
    }
  }

  formatText(text: string) {
    const result = text.replaceAll('*', '');
    return result;
  }
  scrollToBottom(): void {
    setTimeout(() => {
      const chatHistory = document.querySelector('.chat-history') as HTMLElement;
      if (chatHistory) {
        chatHistory.scrollTo({
          top: chatHistory.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 0); 
  }
  
  focusInput() {
    this.messageInput.nativeElement.focus();
  }
  
}
