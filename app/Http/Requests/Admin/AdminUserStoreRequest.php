<?php

namespace App\Http\Requests\Admin;

use App\Models\Ticket;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class AdminUserStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:50', 'unique:users,phoneNumber'],
            'status' => ['required', 'string', 'in:PENDING,VERIFIED'],
            'joinedDate' => ['nullable', 'date'],
            'ticketNumbers' => ['nullable', 'array'],
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
