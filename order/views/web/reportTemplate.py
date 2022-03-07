
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from order.models import ReportTemplate
from order.views.web.serialize import serialize_reportTemplate

@require_GET
def getReportTemplate(request):
    # reportTemplate = ReportTemplate.objects.raw('SELECT * FROM order_reporttemplate order by template_name, template_type')
    reportTemplate = ReportTemplate.objects.all().order_by('template_name, template_type')
    return JsonResponse({'values': [serialize_reportTemplate(x) for x in reportTemplate]}, status=200)
