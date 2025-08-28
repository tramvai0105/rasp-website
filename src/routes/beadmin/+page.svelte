<script>
    const {data} = $props();
</script>

<div>
    {JSON.stringify(data.result)}
</div>

<form method="POST" action="?/login" use:enhance>
    <input placeholder="codekey..." name="codekey"/>
    <button type="submit">Send</button>
</form>

<style>
    input{
        border: 1px solid black;
    }
</style>