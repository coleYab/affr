<?php

namespace App\Notifications;

use App\Models\Winner;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WinnerAnnounced extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Winner $winner,
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $amount = $this->winner->prize_amount;
        $prizeText = $amount !== null
            ? sprintf('%s (ETB %s)', $this->winner->prize_name, number_format($amount))
            : $this->winner->prize_name;

        return (new MailMessage)
            ->subject('Congratulations! You are a winner')
            ->greeting('Congratulations!')
            ->line(sprintf('You have won %s for cycle %d.', $prizeText, $this->winner->cycle))
            ->line(sprintf('Winning ticket: #%d', $this->winner->ticket->ticketNumber))
            ->action('Open Dashboard', url('/dashboard'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'winner_id' => $this->winner->id,
            'cycle' => $this->winner->cycle,
            'place' => $this->winner->place,
            'prize_name' => $this->winner->prize_name,
            'prize_amount' => $this->winner->prize_amount,
        ];
    }
}
