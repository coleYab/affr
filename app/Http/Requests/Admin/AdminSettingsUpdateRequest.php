<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AdminSettingsUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'cycle' => ['required', 'integer', 'min:1'],
            'daysRemaining' => ['required', 'integer', 'min:0'],
            'drawDate' => ['required', 'date'],
            'prizeName' => ['required', 'string', 'max:255'],
            'prizeValue' => ['required', 'string', 'max:255'],
            'prizeImage' => ['nullable', 'string', 'url', 'max:2048'],
            'prizeImages' => ['nullable', 'array'],
            'prizeImages.*' => ['string', 'url', 'max:2048'],
            'liveStreamUrl' => ['nullable', 'string', 'url', 'max:2048'],
            'isLive' => ['required', 'boolean'],
            'registrationEnabled' => ['required', 'boolean'],
            'ticketSelectionEnabled' => ['required', 'boolean'],
            'winnerAnnouncementMode' => ['required', 'boolean'],
            'nextDrawDateEn' => ['nullable', 'string', 'max:255'],
            'nextDrawDateAm' => ['nullable', 'string', 'max:255'],
        ];
    }
}
