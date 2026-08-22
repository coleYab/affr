<?php

namespace App\Http\Requests\Admin;

use App\Models\Ticket;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class AdminUserTicketsStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null && $this->user()->is_admin;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'ticketNumbers' => ['required', 'array', 'min:1'],
            'ticketNumbers.*' => ['required', 'integer', 'min:1', 'max:5000', 'distinct', 'exists:tickets,ticketNumber'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $ticketNumbers = $this->input('ticketNumbers');

            if (! is_array($ticketNumbers) || $ticketNumbers === []) {
                return;
            }

            $takenTickets = Ticket::query()
                ->whereIn('ticketNumber', $ticketNumbers)
                ->where('status', '!=', 'AVAILABLE')
                ->pluck('ticketNumber')
                ->all();

            if ($takenTickets !== []) {
                $validator->errors()->add('ticketNumbers', 'Some ticket numbers are not available: '.implode(', ', $takenTickets));
            }
        });
    }
}
